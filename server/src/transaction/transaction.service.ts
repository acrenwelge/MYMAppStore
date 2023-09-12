import { Injectable } from '@nestjs/common';
import { TransactionDto } from './transaction.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {TransactionEntity} from "./entities/transaction.entity";
import {Repository} from "typeorm";
import { TransactionDetailEntity } from './entities/transaction-detail.entity';

@Injectable()
export class TransactionService {

  constructor(
    @InjectRepository(TransactionEntity)
    private txRepo: Repository<TransactionEntity>,
    @InjectRepository(TransactionDetailEntity)
    private txDetailRepo: Repository<TransactionDetailEntity>,
) {}

  create(newTx: any) {
    // is this needed?
    // for (const detail of newTx.transactionDetails) {
    //   const detailEnt = this.txDetailRepo.create(detail);
    // }
    const newTxEnt = this.txRepo.create(newTx)
    return this.txRepo.save(newTxEnt)
  }

  async findAll() {
    const transactions = await this.txRepo.find({
      relations: ["transactionDetails", "user"]
    });
    return transactions
  }

  async findOne(id: number) {
    return await this.txRepo.findOne({where: {txId: id}});
  }

}