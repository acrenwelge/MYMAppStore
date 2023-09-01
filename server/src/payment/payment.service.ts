import { Injectable } from '@nestjs/common';
import * as paypal from "./paypal-api";
import { SubscriptionService } from 'src/subscription/subscription.service';
import {TransactionService} from "../transaction/transaction.service";
import { TransactionDto } from 'src/transaction/transaction.dto';


@Injectable()
export class PaymentService {

    constructor(private readonly subscriptionService: SubscriptionService,
                private readonly transactionService:TransactionService) {}

    async create(req, res) {
        const amount = req.body['cart'][0]['amount'];
        // console.log('create amount',amount)
        try {
            const order = await paypal.createOrder(amount);
            res.json(order);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    async capture(req, res) {
        const { orderID } = req.body;
        // console.log('Record an order:', amount, item_id, purchase_code, user_id);
        try {
            const captureData = await paypal.capturePayment(orderID);
            res.json(captureData);
        } catch (err) {
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
