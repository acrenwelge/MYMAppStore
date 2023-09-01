import {Module} from '@nestjs/common';
import {TypeOrmModule} from '@nestjs/typeorm';
import {ConfigModule} from "@nestjs/config";
import {ServeStaticModule} from "@nestjs/serve-static";
import {UserModule } from './user/user.module';
import {UserEntity} from "./user/entities/user.entity";
import {AuthModule } from './auth/auth.module';
import {AdminModule } from './admin/admin.module';
import {TransactionModule } from './transaction/transaction.module';
import {SubscriptionModule } from './subscription/subscription.module';
import {ItemModule } from './item/item.module';
import {PurchaseCodeModule } from './purchaseCode/purchaseCode.module';
import {ItemEntity} from "./item/item.entity";
import {PurchaseCodeEntity} from "./purchaseCode/purchaseCode.entity";
import {TransactionEntity} from "./transaction/entities/transaction.entity";
import {SubscriptionEntity} from "./subscription/subscription.entity";
import { EmailModule } from './email/email.module';
import { BookModule } from './book/book.module';

import { PaymentModule } from './payment/payment.module';
import {FreeSubscriptionEntity} from "./free-subscription/free-subscription.entity";
import {join} from 'path';
import { TransactionDetailEntity } from './transaction/entities/transaction-detail.entity';

let envFilePath = [];
if (process.env.RUNNING_ENV === 'dev') {
    envFilePath.unshift('.env.dev');
}
if (process.env.RUNNING_ENV === 'heroku') {
    envFilePath.unshift('.env.heroku');
}
if (process.env.RUNNING_ENV === 'prod') {
    envFilePath.unshift('.env.prod');
}

@Module({
    imports: [
        // ServeStaticModule.forRoot({
        //     rootPath: join(__dirname, '../', 'public','textbook')
        // }),
        ServeStaticModule.forRoot({
            rootPath: join(__dirname, '../', 'public')
        }),
        ConfigModule.forRoot({
            isGlobal: true,
            envFilePath: envFilePath
        }),
        TypeOrmModule.forRoot({
            type: 'mysql',
            host: process.env.DB_Host,
            port: Number(process.env.DB_Port),
            username: process.env.DB_Username,
            password: process.env.DB_Password,
            database: process.env.DB_Database,
            entities:[
                UserEntity, ItemEntity, PurchaseCodeEntity, SubscriptionEntity,
                TransactionEntity, TransactionDetailEntity, FreeSubscriptionEntity
            ],
            synchronize: process.env.ENV_TYPE === 'DEV' ? true: false,
        }),
        UserModule,
        AuthModule,
        AdminModule,
        TransactionModule,
        SubscriptionModule,
        ItemModule,
        PurchaseCodeModule,
        EmailModule,
        PaymentModule,
        BookModule,
    ],
    providers: [],
    controllers: [],
})
export class AppModule {}
