import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import {UserModule} from "../user/user.module";
import {RolesGuard} from "../auth/guards/roles.guard";
import { PurchaseCodeModule } from 'src/purchaseCode/purchaseCode.module';
import { TransactionModule } from 'src/transaction/transaction.module';
import {FreeSubscriptionModule} from "../free-subscription/free-subscription.module";
import { EmailModule } from 'src/email/email.module';

@Module({
  imports:[UserModule, PurchaseCodeModule, TransactionModule,FreeSubscriptionModule,EmailModule],
  controllers: [AdminController],
  providers:[RolesGuard]
})
export class AdminModule {}
