import { Injectable } from '@nestjs/common';
import { TransactionDto } from './transaction.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {TransactionEntity} from "./entities/transaction.entity";
import {Repository} from "typeorm";
import { TransactionDetailEntity } from './entities/transaction-detail.entity';
import Cart from 'src/payment/payment.entity';

@Injectable()
export class TransactionService {

  constructor(
    @InjectRepository(TransactionEntity)
    private txRepo: Repository<TransactionEntity>,
    @InjectRepository(TransactionDetailEntity)
    private txDetailRepo: Repository<TransactionDetailEntity>,
  ) {}

  // public entityToDto(tx: TransactionEntity): TransactionDto {
  //   const dto = new TransactionDto();
  //   dto.txId = tx.txId;
  //   dto.total = tx.total;
  //   dto.date = tx.date;
  //   dto.user = tx.user;
  //   dto.transactionDetails = tx.transactionDetails;
  //   return dto;
  // }

  /**
   * Creates Transaction and TransactionDetail entities from the cart that the user has purchased.
   * @param cart 
   * @returns 
   */
  async createAndSaveFromPurchaseCart(cart: Cart) {
    let txDetails: TransactionDetailEntity[] = [];
    for (const purchasedItem of cart.items) {
        let detail = this.txDetailRepo.create();
        detail.item = <any> purchasedItem.itemId;
        // detail.quantity: purchasedItem.quantity
        detail.finalPrice = purchasedItem.finalPrice;
        if (purchasedItem.purchaseCode) {
            detail.purchaseCode = <any> purchasedItem.purchaseCode
        }
        txDetails.push(detail)
    }
    // assign fields and save
    const newTxEnt = this.txRepo.create()
    newTxEnt.user = <any> cart.purchaserUserId;
    newTxEnt.total = cart.grandTotal;
    newTxEnt.transactionDetails = txDetails;
    return this.txRepo.save(newTxEnt)
  }

  async findAll() {
    const transactions = await this.txRepo.find({
      relations: ["transactionDetails", "user"]
    });
    return transactions
  }

  async findOne(txId: number) {
    return await this.txRepo.findOne({
      relations: ["transactionDetails", "user"],
      where: {txId}
    });
  }

  async findAllForUser(userId: number) {
    return await this.txRepo.findOne({
      relations: ["transactionDetails", "user"],
      where: {user: {userId}}
    });
  }

}