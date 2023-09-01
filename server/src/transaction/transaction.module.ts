import { Module } from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionController } from './transaction.controller';
import {TypeOrmModule} from "@nestjs/typeorm";
import {TransactionEntity} from "./entities/transaction.entity";
import { TransactionDetailEntity } from './entities/transaction-detail.entity';

@Module({
  imports:[TypeOrmModule.forFeature([TransactionEntity, TransactionDetailEntity])],
  controllers: [TransactionController],
  providers: [TransactionService], 
  exports: [TransactionService]
})
export class TransactionModule {}
