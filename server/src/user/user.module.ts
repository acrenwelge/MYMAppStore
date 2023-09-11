import { Module } from '@nestjs/common';
import {TypeOrmModule} from "@nestjs/typeorm";
import {UserEntity} from "./entities/user.entity";
import { UserService } from './user.service';
import { EmailModule } from "../email/email.module";
import { SubscriptionService } from 'src/subscription/subscription.service';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { ClassEntity } from 'src/class/class.entity';

@Module({
  imports:[TypeOrmModule.forFeature([UserEntity, ClassEntity]), EmailModule, SubscriptionModule],
  providers: [UserService],
  exports:[UserService]
})
export class UserModule {}
