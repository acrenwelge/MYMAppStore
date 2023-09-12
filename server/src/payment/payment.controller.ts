import {Body, Controller, Post, Res, UseGuards, Request, HttpCode} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {TransactionEntity} from "../transaction/entities/transaction.entity";
import Cart, { PayPalOrderDetails, PaypalCreateOrderResponse } from './payment.entity';

@Controller('payment')
export class PaymentController {

    constructor(private readonly paymentService: PaymentService) {}

    // @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    @Post('create-paypal-order')
    async create(@Body() cartData: Cart, @Res() res: Response<PaypalCreateOrderResponse>) {
        console.log('create-paypal-order', cartData);
        await this.paymentService.create(cartData, res);
    }
    
    @HttpCode(200)
    @Post('capture-paypal-order')
    async capture(@Body() orderData: PayPalOrderDetails, @Res() res: Response) {
        await this.paymentService.capture(orderData, res);
    }

    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @Post('finish-purchasing')
    async finishPurchasing(@Request() req, @Body() body: TransactionEntity) {
        // TODO: implement
        return this.paymentService.recordPurchase()
    }
}

