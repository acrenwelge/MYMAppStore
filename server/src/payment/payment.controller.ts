import {Body, Controller, Post, Res, UseGuards, Request, HttpCode, HttpStatus} from '@nestjs/common';
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
    @Post('create-paypal-order')
    @HttpCode(HttpStatus.OK)
    async create(@Body() cartData: Cart, @Res() res: Response<PaypalCreateOrderResponse>) {
        console.log('create-paypal-order', cartData);
        await this.paymentService.createPaypalOrder(cartData, res);
    }
    
    @Post('capture-paypal-order')
    @HttpCode(HttpStatus.OK)
    async capture(@Body() orderData: PayPalOrderDetails, @Res() res: Response) {
        console.log("__FUNCTION__capture-paypal-order()")
        const result = await this.paymentService.captureAndRecordTx(orderData, res);
        if (result) {
            console.log("__FUNCTION__capture-paypal-order()")
            console.log("\tbefore addOrExtendSubs, recipientIds =", orderData.recipientIds)
            await this.subService.addOrExtendSubscriptions(orderData.cart, orderData.recipientIds);
            console.log("\tafter addOrExtendSubs")
            
        } else {
            console.error('Failed to capture payment');
        }
    }
}

function useContext(ApplicationContext: any) {
    throw new Error('Function not implemented.');
}

