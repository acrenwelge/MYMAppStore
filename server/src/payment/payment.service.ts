import { Injectable } from '@nestjs/common';
import * as paypal from "./paypal-api";
import { RecordService } from 'src/record/record.service';
import {TransactionService} from "../transaction/transaction.service";


@Injectable()
export class PaymentService {

    constructor(private readonly recordService: RecordService,
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

    async finishPurchasing(user_id:number,code_id:number,item_id:number,price:number) {
        const recordResult = await this.recordService.update(user_id, item_id);
        const transactionResult = await this.transactionService.update(user_id, item_id, code_id,price);
        return {
            recordResult,transactionResult
        }
    }
}
