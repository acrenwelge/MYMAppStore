import { Injectable } from '@nestjs/common';
import * as paypal from "./paypal-api";
import {TransactionService} from "../transaction/transaction.service";
import Cart, { PayPalOrderDetails } from './payment.entity';

@Injectable()
export class PaymentService {

    constructor(private readonly txService: TransactionService) {}

    /**
     * Creates a PayPal order for the cart and returns the order details.
     * Client can use the order details to call PaymentController again and confirm the purchase and record the transaction.
     * @param cart - contains the purchaser's user ID, the grand total, and the items in the cart
     * @param res
     */
    async createPaypalOrder(cart: Cart, res) {
        // TODO: validate purchase codes and grand total
        try {
            const order = await paypal.createOrder(cart.grandTotal);
            res.json(order);
        } catch (err) {
            res.status(500).send(err.message);
        }
    }

    /**
     * Calls PayPal API to capture the payment for the order and then records the transaction in the database.
     * @param orderData - contains the order ID and the cart data
     * @param res 
     * @returns 
     */
    async captureAndRecordTx(orderData: PayPalOrderDetails, res): Promise<boolean> {
        console.log('Record a payment for order:', orderData.orderId);
        try {
            const captureData = await paypal.capturePayment(orderData.orderId);
            console.log('Capture data:', captureData);
            // now that the payment has been captured, record the transaction
            this.txService.createAndSaveFromPurchaseCart(orderData.cart);
            res.json(captureData);
            return Promise.resolve(true);
        } catch (err) {
            console.error(err);
            res.status(500).send(err.message);
            return Promise.resolve(false);
        }
    }
}
