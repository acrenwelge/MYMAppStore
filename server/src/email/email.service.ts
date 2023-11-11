import {readFileSync} from 'fs'
import {forwardRef, Inject, Injectable, Logger, OnModuleDestroy} from "@nestjs/common";
import { createTransport, getTestMessageUrl } from "nodemailer";
import Mail from "nodemailer/lib/mailer";
import Handlebars from "handlebars";
import {UserService} from "../user/user.service";
import * as path from "path";
import { UserDto } from 'src/user/user.dto';

type ActivateAccountParams = {
    name: string;
    email: string;
    storeDomain: string;
    activateAccountRoute: string;
    activationCode: string;
    contactMailAddress: string;
};

type ReminderParams = {
    name: string;
    expireDate: string;
}

/**
 * @description Service for sending emails to users. Initializes based on the EMAIL_ENABLE environment variable which
 * can be one of three values:
 * - "true" - emails are sent to users
 * - "false" - emails are not sent to users
 * - "test" - emails are not sent to users, but a preview URL is printed to the console for a dummy email
 * Generally, "false" or "test" are used for development and "true" is used for production.
 */
@Injectable()
export class EmailService implements OnModuleDestroy {

    private readonly transporter: Mail;
    private readonly activateAccountTemplateDelegate: HandlebarsTemplateDelegate<ActivateAccountParams>;
    private readonly remindExpirationTemplateDelegate: HandlebarsTemplateDelegate<ReminderParams>;
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
            this.remindExpirationTemplateDelegate = Handlebars.compile(
                readFileSync(path.resolve(appDirectory,"src","email","templates","expiration-reminder.template.txt")).toString()
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

    public async sendActivateAccountEmail(user: UserDto): Promise<void> {
        const dbUser = await this.userService.findOneByEmail(user.email);
        if (process.env.EMAIL_ENABLE === 'false') {
            await this.userService.activateAccount(dbUser.activationCode!);
            this.logger.log("Mail disabled. Activate account manually.");
            return;
        }
        const htmlText = this.activateAccountTemplateDelegate({
            name: dbUser.firstName + " " + dbUser.lastName,
            email: dbUser.email,
            storeDomain: process.env.MYMASTORE_DOMAIN,
            activateAccountRoute: process.env.MYMA_ACTIVATE_ACCOUNT_ROUTE,
            activationCode: dbUser.activationCode!,
            contactMailAddress: process.env.CONTACT_MAIL_ADDRESS
        });
        this.sendEmail(dbUser.email, "Activate MYMathApps Account", htmlText)
    }

    /**
     * TODO: retrieve subscription expiration date from database
     * Where would this be called? Does the logic for expiring need to be in here? - Spencer
     **/
    public async sendReminderEmail(user: UserDto): Promise<void> {
        const htmlText = this.remindExpirationTemplateDelegate({
            name: user.firstName + " " + user.lastName,
            expireDate: "TODO"
        });
        this.sendEmail(user.email, "MYMathApps Account About to Expire", htmlText);
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
