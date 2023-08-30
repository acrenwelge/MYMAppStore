import {readFileSync} from 'fs'
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
        const htmlText = this.activateAccountTemplateDelegate({
            name: user.name,
            email: user.email,
            storeDomain: process.env.MYMASTORE_DOMAIN,
            activateAccountRoute: process.env.MYMA_ACTIVATE_ACCOUNT_ROUTE,
            activationCode: user.activationCode!,
            contactMailAddress: process.env.CONTACT_MAIL_ADDRESS
        });
        this.sendEmail(user.email, "Activate MYMathApps Account", htmlText)
    }

    /**
     * TODO: retrieve subscription expiration date from database
     **/
    public async sendReminderEmail(user: User): Promise<void> {
        const text = `
        Dear ${user.name},
        Your MYMathApps account subscription is about to expire. If you would like to maintain access to your MYMathApps
        products, please login and review the options to extend your subscription.
        Sincerely,
        The MYMathApps Team
        `;
        this.sendEmail(user.email, "MYMathApps Account About to Expire", text);
    }

    public async sendEmail(email: string, subject: string, text: string): Promise<void> {
        if (process.env.EMAIL_ENABLE === 'false') {
            this.logger.log("Email feature disabled. Cannot send email.");
            return;
        }
        return this.transporter.sendMail({
            from: this.from,
            to: email,
            subject: subject,
            html: text
        })
        .then((info) => {
            console.log(`Sent email to ${email} from ${this.from}`);
                if (process.env.EMAIL_ENABLE === 'test') {
                    console.log('TESTING MODE - no email was sent');
                    console.log('Preview URL: ' + getTestMessageUrl(info));
                }
        })
        .catch((e: Error) => {
            this.logger.error(e.message);
            this.logger.error(`There was an error sending the email from ${this.from} to ${email}`);
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
