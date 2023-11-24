import {Controller, Get, Post, HttpCode, UseGuards, Body, Param, Delete, Put, HttpStatus} from '@nestjs/common';
import {PurchaseCodeService} from "./purchaseCode.service";
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { NeedRole } from 'src/roles/roles.decorator';
import { Roles } from 'src/roles/role.enum';

@UseGuards(AuthGuard('jwt'),RolesGuard)
@NeedRole(Roles.Admin)
@Controller('purchaseCode')
export class PurchaseCodeController {
    
    constructor(private readonly purchaseCodeService: PurchaseCodeService) {}

    @Get()
    getAllPurchaseCodes() {
        return this.purchaseCodeService.findAll();
    }

    @Get(':name')
    getOnePurchaseCode(@Param('name') name: string) {
        return this.purchaseCodeService.findOne(name);
    }
    
    @Post()
    @HttpCode(HttpStatus.CREATED)
    addPurchaseCode(@Body() purchaseCodeDto) {
        return this.purchaseCodeService.createOne(purchaseCodeDto);
    }

    @Put(':name')
    @HttpCode(HttpStatus.OK)
    updatePurchaseCode(@Param('name') name: string, @Body() updatePurchaseCodeDto) {
        return this.purchaseCodeService.update(name, updatePurchaseCodeDto);
    }

    @NeedRole(Roles.User)
    @Post("validate")
    async checkValidPurchaseCode(@Body() code: {name: string, itemId: number}) {
        return this.purchaseCodeService.validateCode(code.name, code.itemId);
    }

    @Delete(":name")
    @HttpCode(HttpStatus.NO_CONTENT)
    public async deleteCode(@Param('name') name: string) {
        return this.purchaseCodeService.deleteCode(name);
    }

}
