import {readFileSync} from 'fs'
import {join} from "path";
import {forwardRef, Inject, Injectable, Logger, OnModuleDestroy} from "@nestjs/common";
import { createTransport, getTestMessageUrl } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import Handlebars from "handlebars";
import {UserService} from "../user/user.service";
import { User } from "../user/entities/user.entity";
import * as path from "path";

type ActivateAccountParams = {
    name: string;
    email: string;
    storeDomain: string;
    activateAccountRoute: string;
    activationCode: string;
    contactMailAddress: string;
};

@Injectable()
export class EmailService implements OnModuleDestroy {

    private readonly transporter: Mail;
    private readonly activateAccountTemplateDelegate: HandlebarsTemplateDelegate<ActivateAccountParams>;
    private readonly from?: string;

    private readonly logger = new Logger("EmailService");

    constructor(
        @Inject (forwardRef(() => UserService)) private readonly userService: UserService
) {
        {
            const appDirectory = process.cwd();
            this.activateAccountTemplateDelegate = Handlebars.compile(
                readFileSync(path.resolve(appDirectory,"src","email","templates","activate-account.template.txt")).toString()
            );
            this.from = `MYMathApps <${process.env.EMAIL_USERNAME}>`;
            if (process.env.EMAIL_ENABLE === 'true' || process.env.EMAIL_ENABLE === 'test') {
                const port = Number(process.env.EMAIL_PORT);
                const mailUsername = process.env.EMAIL_USERNAME;
                this.from = `MYMathApps <${mailUsername}>`;
                this.transporter = createTransport({
                    host: process.env.EMAIL_HOST,
                    port: port,
                    // 465 is the secure port for SMTP although research says it is deprecated.
                    secure: false,
                    auth: {
                        user: mailUsername!,
                        pass: process.env.EMAIL_PASSWORD
                    }
                });
                if (!this.healthy()) {
                    process.exit(1);
                } else {
                    this.logger.log("Email transport verified");
                }
            } else {
                this.transporter = createTransport({
                    jsonTransport: true
                });
                console.log("Email disabled");
            }
        }
    }

    public async sendActivateAccountEmail(user: User): Promise<void> {
        if (process.env.EMAIL_ENABLE === 'false') {
            await this.userService.activateAccount(user.activationCode!);
            this.logger.log("Mail disabled. Activate account manually.");
            return;
        }
        const text = this.activateAccountTemplateDelegate({
            name: user.name,
            email: user.email,
            storeDomain: process.env.MYMASTORE_DOMAIN,
            activateAccountRoute: process.env.MYMA_ACTIVATE_ACCOUNT_ROUTE,
            activationCode: user.activationCode!,
            contactMailAddress: process.env.CONTACT_MAIL_ADDRESS
        });
        this.transporter.sendMail({
            from: this.from,
            to: user.email,
            subject: "Activate MyMathApp Account",
            html: text
        })
        .then((info) => {
            console.log(`Sent activate account email to ${user.email}`);
            console.log('Preview URL: ' + getTestMessageUrl(info));
        })
        .catch((e: Error) => {
            this.logger.error(e.message)
            this.logger.error("Send Error")
        });
    }

    onModuleDestroy(): any {
        if (process.env.EMAIL_ENABLE) {
            this.transporter.close();
        }
    }
    async healthy(): Promise<boolean> {

        try {
            return await this.transporter.verify();
        } catch (_e) {
            const e = _e as Error;
            this.logger.error(e.message);
            return false;
        }
    }
}
