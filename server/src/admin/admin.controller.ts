import {Controller, Get, UseGuards, Post, HttpCode, Request, Body, Put, Delete, Param, HttpStatus} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {NeedRole} from "../roles/roles.decorator";
import {Role} from "../roles/role.enum";
import {RolesGuard} from "../auth/guards/roles.guard";
import {AuthGuard} from "@nestjs/passport";
import {PurchaseCodeService} from '../purchaseCode/purchaseCode.service';
import { PurchaseCodeEntity } from 'src/purchaseCode/purchaseCode.entity';
import { ItemService } from 'src/item/item.service';
import { Item } from 'src/item/entities/item.entity';
import {TransactionService} from '../transaction/transaction.service';
import { Transaction } from 'src/transaction/entities/transaction.entity';
import {EmailSubscriptionService} from "../email-subscription/email-subscription.service";
import {EmailSubscription} from "../email-subscription/email-subscription.entity";
import { User } from 'src/user/entities/user.entity';
import { PurchaseCodeDto } from 'src/purchaseCode/purchaseCode.dto';
import { EmailService } from 'src/email/email.service';

@UseGuards(AuthGuard('jwt'),RolesGuard)
@Controller('admin')
@NeedRole(Role.Admin)
export class AdminController {
    constructor(private readonly userService: UserService,
        private readonly purchaseCodeService: PurchaseCodeService,
        private readonly transactionService: TransactionService,
        private readonly emailSubscriptionService: EmailSubscriptionService,
        private readonly emailService: EmailService) {}

    @Get("user")
    findAllUser() {
        return this.userService.findAll();
    }

    @Delete("user/:id")
    @HttpCode(HttpStatus.OK)
    public async deleteUser(@Param('id') userId: number){
        return this.userService.deleteOne(userId);
    }

    @Put("user/:id")
    @HttpCode(HttpStatus.OK)
    public async updateUser(@Body() user: User){
        console.log('updating user:', user)
        return this.userService.updateOne(user);
    }

    @Post("user/:id/sendActivateEmail")
    @HttpCode(HttpStatus.OK)
    public async sendAccountActivationEmail(@Body() user: User){
        console.log('sending account activation email to:', user.email);
        return this.emailService.sendActivateAccountEmail(user);
    }

    @Get("transaction")
    findAllTransaction() {
        return this.transactionService.findAll()
    }

    @Get("purchaseCode")
    findAllPurchaseCode() {
        return this.purchaseCodeService.findAll();
    }

    @Post("add-code")
    @HttpCode(200)
    // local strategy has a default name of 'local'. code supplied by the passport-local package
    public async addCode(@Body() newPurchaseCode:PurchaseCodeEntity) {
        console.log(newPurchaseCode);
        return this.purchaseCodeService.addOne(newPurchaseCode.name, newPurchaseCode.priceOff)
    }

    @Post("delete-code")
    @HttpCode(200)
    public async deleteCode(@Body() newPurchaseCode:PurchaseCodeEntity){
        // console.log("server admin");
        // console.log(newPurchaseCode.code_id);
        return this.purchaseCodeService.deleteCode(newPurchaseCode.code_id)

    }

    @Post("update-code")
    @HttpCode(200)
    public async updateCode(@Body() newPurchaseCode: PurchaseCodeDto){
        // console.log(newPurchaseCode.code_id);
        return this.purchaseCodeService.update(newPurchaseCode)
    }

    @Get("emailSubscription")
    findAllEmailSub() {
        return this.emailSubscriptionService.findAll();
    }

    @Post("add-emailsub")
    @HttpCode(200)
    // local strategy has a default name of 'local'. code supplied by the passport-local package
    public async addEmailSub(@Body() newEmailSubscription:EmailSubscription) {
        return this.emailSubscriptionService.addOne(newEmailSubscription.suffix)
    }

    @Post("delete-emailsub")
    @HttpCode(200)
    public async deleteEmailSub(@Body() newEmailSubscription:EmailSubscription){
        return this.emailSubscriptionService.deleteEmailSub(newEmailSubscription.email_sub_id)

    }

    @Post("update-emailsub")
    @HttpCode(200)
    public async updateEmailSub( @Body() newEmailSubscription:EmailSubscription){
        return this.emailSubscriptionService.updateEmailSub(newEmailSubscription.email_sub_id,newEmailSubscription.suffix)
    }

}
