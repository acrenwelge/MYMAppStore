import {Controller, ForbiddenException, Get, Injectable, Res} from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import {RecordService} from "../record/record.service";
import {EmailSubscriptionService} from "../email-subscription/email-subscription.service";
import { UserService } from 'src/user/user.service';
import { Role } from 'src/roles/role.enum';

@Injectable()
export class BookService {

    constructor(readonly recordService:RecordService,
        readonly emailSubscriptionService:EmailSubscriptionService,
        readonly userService:UserService) {
    }

    // async getBookContent() {
    //     const appDirectory = process.cwd();
    //     const bookPath = path.resolve(appDirectory,"src","book","bookContent","index.html")
    //
    //     const fileContent = await fs.promises.readFile(bookPath, 'utf-8');
    //    return fileContent
    // }

    async getBookURL(userID: number, itemName: string) {
        const user = await this.userService.findOneById(userID);
        const ifPurchase = await this.recordService.checkIfUserPurchaseItem(userID, itemName);
        const ifEmailSub = await this.emailSubscriptionService.checkIfUserEmailSubItem(user.email);
        if (ifPurchase || ifEmailSub || user.role == Role.Admin) {
            return  {
                bookURL: process.env.BOOK_ROOT_PATH,
                ifPurchase:ifPurchase,
                ifEmailSub:ifEmailSub
            }
        } else {
            throw new ForbiddenException()
        }
    }
}
