import {Body, Controller, Post, Res, UseGuards, Request, HttpCode} from '@nestjs/common';
import { PaymentService } from './payment.service';
import { Response } from 'express';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import {TransactionEntity} from "../transaction/entities/transaction.entity";
import Cart, { PayPalOrderDetails, PaypalCreateOrderResponse } from './payment.entity';
import { SubscriptionService } from 'src/subscription/subscription.service';

@Controller('payment')
export class PaymentController {

    constructor(
        private readonly paymentService: PaymentService,
        private readonly subService: SubscriptionService) {}

    // @UseGuards(JwtAuthGuard)
    @HttpCode(200)
    @Post('create-paypal-order')
    async create(@Body() cartData: Cart, @Res() res: Response<PaypalCreateOrderResponse>) {
        console.log('create-paypal-order', cartData);
        await this.paymentService.createPaypalOrder(cartData, res);
    }
    
    @HttpCode(200)
    @Post('capture-paypal-order')
    async capture(@Body() orderData: PayPalOrderDetails, @Res() res: Response) {
        const result = await this.paymentService.captureAndRecordTx(orderData, res);
        if (result) {
            await this.subService.addOrExtendSubscriptions(orderData.cart);
        } else {
            console.error('Failed to capture payment');
        }
    }
}

