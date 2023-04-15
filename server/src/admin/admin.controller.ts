import {Controller, Get, UseGuards, Post, HttpCode, Request, Body} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {NeedRole} from "../roles/roles.decorator";
import {Role} from "../roles/role.enum";
import {RolesGuard} from "../auth/guards/roles.guard";
import {AuthGuard} from "@nestjs/passport";
import {PurchaseCodeService} from '../purchaseCode/purchaseCode.service';
import { PurchaseCode } from 'src/purchaseCode/purchaseCode.entity';
import { ItemService } from 'src/item/item.service';
import { Item } from 'src/item/entities/item.entity';
import {TransactionService} from '../transaction/transaction.service';
import { Transaction } from 'src/transaction/entities/transaction.entity';


@UseGuards(AuthGuard('jwt'),RolesGuard)
@Controller('admin')
@NeedRole(Role.Admin)
export class AdminController {
    constructor(private readonly userService:UserService,
        private readonly PurchaseCodeService:PurchaseCodeService,
        private readonly transactionService:TransactionService) {}

    @Get("user")
    findAllUser() {
        return this.userService.findAll();
    }

    @Get("transaction")
    findAllTransaction() {
        return this.transactionService.findAll()
    }

    @Get("purchaseCode")
    findAllPurchaseCode() {
        return this.PurchaseCodeService.findAll();
    }



    @Post("add-code")
    @HttpCode(200)
    // local strategy has a default name of 'local'. code supplied by the passport-local package
    public async addCode(@Body() newPurchaseCode:PurchaseCode) {
        console.log(newPurchaseCode);
        return this.PurchaseCodeService.addOne(newPurchaseCode.name, newPurchaseCode.priceOff)
    }

    @Post("delete-code")
    @HttpCode(200)
    public async deleteCode(@Body() newPurchaseCode:PurchaseCode){
        console.log("server admin");
        console.log(newPurchaseCode.code_id);
        return this.PurchaseCodeService.deleteCode(newPurchaseCode.code_id)

    }

    @Post("update-code")
    @HttpCode(200)
    public async updateCode( @Body() newPurchaseCode:PurchaseCode){
        console.log(newPurchaseCode.code_id);
        return this.PurchaseCodeService.updateCode(newPurchaseCode.code_id, newPurchaseCode.priceOff)
    }

}
