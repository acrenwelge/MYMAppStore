import {Controller, Get, UseGuards, Post, HttpCode, Request, Body, Put, Delete, Param, HttpStatus} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {NeedRole} from "../roles/roles.decorator";
import {Roles} from "../roles/role.enum";
import {RolesGuard} from "../auth/guards/roles.guard";
import {AuthGuard} from "@nestjs/passport";
import {PurchaseCodeService} from '../purchaseCode/purchaseCode.service';
import {TransactionService} from '../transaction/transaction.service';
import {FreeSubscriptionService} from "../free-subscription/free-subscription.service";
import { PurchaseCodeDto } from 'src/purchaseCode/purchaseCode.dto';
import { EmailService } from 'src/email/email.service';
import { UserDto } from 'src/user/user.dto';

@UseGuards(AuthGuard('jwt'),RolesGuard)
@Controller('admin')
@NeedRole(Roles.Admin)
export class AdminController {
    constructor(private readonly userService: UserService,
        private readonly purchaseCodeService: PurchaseCodeService,
        private readonly transactionService: TransactionService,
        private readonly freeSubService: FreeSubscriptionService,
        private readonly emailService: EmailService) {}

    @Get("user")
    findAllUser() {
        return this.userService.findAll();
    }

    @Delete("user/:id")
    @HttpCode(HttpStatus.OK)
    public async deleteUser(@Param('id') userId: number) {
        return this.userService.deleteOne(userId);
    }

    @Put("user/:id")
    @HttpCode(HttpStatus.OK)
    public async updateUser(@Body() user: UserDto) {
        console.log('updating user:', user)
        return this.userService.updateOne(user);
    }

    @Post("user/:id/sendActivateEmail")
    @HttpCode(HttpStatus.OK)
    public async sendAccountActivationEmail(@Body() user: UserDto) {
        console.log('sending account activation email to:', user.email);
        return this.emailService.sendActivateAccountEmail(user);
    }

    @Get("transaction")
    findAllTransaction() {
        return this.transactionService.findAll()
    }

    @Get("free-subscription")
    findAllFreeEmailSub() {
        return this.freeSubService.findAll();
    }

    @Post("free-subscription")
    @HttpCode(200)
    public async addEmailSub(@Body() obj: {suffix: string}) {
        return this.freeSubService.addOne(obj.suffix)
    }

    @Put("free-subscription/:id")
    @HttpCode(200)
    public async updateFreeSub(@Param('id') id: number, @Body() obj: {suffix: string}) {
        return this.freeSubService.updateEmailSub(id, obj.suffix)
    }

    @Delete("free-subscription/:id")
    @HttpCode(200)
    public async deleteEmailSub(@Param("id") id: number) {
        return this.freeSubService.deleteEmailSub(id)
    }

}
