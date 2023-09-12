import { Injectable } from '@nestjs/common';
import * as paypal from "./paypal-api";
import { SubscriptionService } from 'src/subscription/subscription.service';
import {TransactionService} from "../transaction/transaction.service";
import { TransactionDetailDto, TransactionDto } from 'src/transaction/transaction.dto';
import Cart, { PayPalOrderDetails } from './payment.entity';

@Injectable()
export class PaymentService {

    constructor(private readonly subervice: SubscriptionService,
                private readonly txService: TransactionService) {}

    async create(cart: Cart, res) {
        // TODO: validate purchase codes and grand total
        try {
            const order = await paypal.createOrder(cart.grandTotal);
            res.json(order);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    async capture(orderData: PayPalOrderDetails, res) {
        console.log('Record a payment for order:', orderData.orderId);
        try {
            const captureData = await paypal.capturePayment(orderData.orderId);
            console.log('Capture data:', captureData);
            // now that the payment has been captured, record the transaction
            // let txDetails: TransactionDetailDto[] = [];
            // for (const prod of orderData.cart.items) {
            //     let detail: any = { 
            //         itemId: prod.itemId,
            //         quantity: prod.quantity
            //     }
            //     if (prod.purchaseCode) {
            //         detail.purchaseCode = prod.purchaseCode
            //     }
            //     txDetails.push(detail)
            // }
            // const transactionDto = {
            //     userId: orderData.cart.purchaserUserId,
            //     transactionDetails: txDetails,
            //     total: orderData.cart.grandTotal,
            // }
            // const newTx = await this.txService.create(transactionDto);
            // assign fields and save
            res.json(captureData);
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
        }
    }

    /**
     * Creates the transaction and subscription database records.
     * If a subscription already exists for the item, it updates the expiration date.
     * @returns 
     */
    async recordPurchase() {
        // TODO: implement
    }
}
