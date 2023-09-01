import {Controller, ForbiddenException, Get, Injectable, Res} from '@nestjs/common';
import { Response } from 'express';
import * as path from 'path';
import * as fs from 'fs';
import {SubscriptionService} from "../subscription/subscription.service";
import {FreeSubscriptionService} from "../free-subscription/free-subscription.service";
import { UserService } from 'src/user/user.service';
import { Roles } from 'src/roles/role.enum';

@Injectable()
export class BookService {

    constructor(readonly subscriptionService: SubscriptionService,
        readonly freeSubsService: FreeSubscriptionService,
        readonly userService: UserService) {
    }

    // async getBookContent() {
    //     const appDirectory = process.cwd();
    //     const bookPath = path.resolve(appDirectory,"src","book","bookContent","index.html")
    //
    //     const fileContent = await fs.promises.readFile(bookPath, 'utf-8');
    //    return fileContent
    // }

    async getBookURL(userID: number, itemId: number) {
        const user = await this.userService.findOneById(userID);
        const hasSubscription = await this.subscriptionService.userHasValidSubscription(userID, itemId);
        const hasFreeAccess = await this.freeSubsService.userEmailHasFreeSubscription(user.email);
        if (hasSubscription || hasFreeAccess || user.role == Roles.Admin) {
            return  {
                bookURL: process.env.BOOK_ROOT_PATH,
                hasSubscription: hasSubscription,
                hasFreeAccess: hasFreeAccess,
            }
        } else {
            throw new ForbiddenException("User does not have a subscription or free access to this item.")
        }
    }
}
