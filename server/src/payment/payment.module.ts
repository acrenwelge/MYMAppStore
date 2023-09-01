import { Module } from '@nestjs/common';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import {TransactionModule} from "../transaction/transaction.module";

@Module({
    imports: [SubscriptionModule,TransactionModule],
    controllers: [PaymentController],
    providers: [PaymentService]
})
export class PaymentModule {}
