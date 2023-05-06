import { Module } from '@nestjs/common';
import { PurchaseCodeService } from './purchaseCode.service';
import { PurchaseCodeController } from './purchaseCode.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {PurchaseCode} from "./purchaseCode.entity"; 
import {UserModule} from "../user/user.module";
import {RolesGuard} from "../auth/guards/roles.guard";


@Module({
  imports:[TypeOrmModule.forFeature([PurchaseCode])],
  controllers: [PurchaseCodeController],
  providers: [PurchaseCodeService],
  exports: [PurchaseCodeService]
})
export class PurchaseCodeModule {}
