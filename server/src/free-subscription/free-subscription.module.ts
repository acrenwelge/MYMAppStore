import { Module } from '@nestjs/common';
import { FreeSubscriptionService } from './free-subscription.service';
import {TypeOrmModule} from "@nestjs/typeorm";
import {FreeSubscriptionEntity} from "./free-subscription.entity";

@Module({
  imports:[TypeOrmModule.forFeature([FreeSubscriptionEntity])],
  providers: [FreeSubscriptionService],
  exports:[FreeSubscriptionService]
})
export class FreeSubscriptionModule {}
