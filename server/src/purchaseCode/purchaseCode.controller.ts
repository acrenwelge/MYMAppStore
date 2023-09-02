import {Controller, Get, Post, HttpCode, Request, UseGuards,Body, Patch, Param, Delete, Put} from '@nestjs/common';
import {PurchaseCodeService} from "./purchaseCode.service";
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { NeedRole } from 'src/roles/roles.decorator';
import { Roles } from 'src/roles/role.enum';

@UseGuards(AuthGuard('jwt'),RolesGuard)
@NeedRole(Roles.Admin)
@Controller('purchaseCode')
export class PurchaseCodeController {
    constructor(private readonly purchaseCodeService:PurchaseCodeService) {}

    @Get()
    getAllPurchaseCodes() {
        return this.purchaseCodeService.findAll();
    }

    @Get(':id')
    getOnePurchaseCode(@Param('id') id: number) {
        return this.purchaseCodeService.findOne(id);
    }
    
    @Post()
    @HttpCode(200)
    addPurchaseCode(@Body() purchaseCodeDto) {
        return this.purchaseCodeService.addOne(purchaseCodeDto);
    }

    @Put(':id')
    updatePurchaseCode(@Param('id') id: number, @Body() updatePurchaseCodeDto) {
        return this.purchaseCodeService.update(id, updatePurchaseCodeDto);
    }

    @Get("validate")
    async checkValidPurchaseCode(@Param('name') name: string) {
        return this.purchaseCodeService.validateCode(name);
    }

    @Delete(":id")
    @HttpCode(200)
    public async deleteCode(@Param('id') id: number) {
        return this.purchaseCodeService.deleteCode(id);
    }


}
