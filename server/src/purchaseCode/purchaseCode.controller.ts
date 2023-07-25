import {Controller, Get, Post, HttpCode, Request, UseGuards,Body, Patch, Param, Delete, Put} from '@nestjs/common';
import {PurchaseCodeService} from "./purchaseCode.service";
@Controller('purchaseCode')
export class PurchaseCodeController {
    constructor(private readonly PurchaseCodeService:PurchaseCodeService) {}

    @Get()
    getAllPurchaseCodes() {
        return this.PurchaseCodeService.findAll();
    }

    @Get(':id')
    getOnePurchaseCode(@Param('id') id: number) {
        return this.PurchaseCodeService.findOne(id);
    }

    @Put(':id')
    updatePurchaseCode(@Body() updatePurchaseCodeDto) {
        return this.PurchaseCodeService.update(updatePurchaseCodeDto);
    }

    @Get("validate")
    async checkValidPurchaseCode(@Param('name') name: string) {
        return this.PurchaseCodeService.validateCode(name);
    }

}
