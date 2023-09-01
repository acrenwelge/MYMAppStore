import { Module } from '@nestjs/common';
import { SubscriptionService } from './subscription.service';
import { SubscriptionController } from './subscription.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {SubscriptionEntity} from "./subscription.entity";
import { ItemEntity } from 'src/item/item.entity';
import { UserModule } from 'src/user/user.module';
import { UserEntity } from 'src/user/entities/user.entity';

@Module({
  imports:[TypeOrmModule.forFeature([SubscriptionEntity, UserEntity, ItemEntity])],
  controllers: [SubscriptionController],
  providers: [SubscriptionService],
  exports: [SubscriptionService]
})
export class SubscriptionModule {}
