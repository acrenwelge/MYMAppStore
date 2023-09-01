import { Module } from '@nestjs/common';
import { PurchaseCodeService } from './purchaseCode.service';
import { PurchaseCodeController } from './purchaseCode.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {PurchaseCodeEntity} from "./purchaseCode.entity"; 
import {UserModule} from "../user/user.module";
import {RolesGuard} from "../auth/guards/roles.guard";
import { ItemEntity } from 'src/item/item.entity';


@Module({
  imports:[TypeOrmModule.forFeature([PurchaseCodeEntity, ItemEntity])],
  controllers: [PurchaseCodeController],
  providers: [PurchaseCodeService],
  exports: [PurchaseCodeService]
})
export class PurchaseCodeModule {}
