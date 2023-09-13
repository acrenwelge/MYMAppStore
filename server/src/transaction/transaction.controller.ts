/* eslint-disable prettier/prettier */
import {Controller, Get, Param} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionDto } from './transaction.dto';

/**
 * @description Clients can send requests to find transactions.
 * Transactions are immutable and cannot be created, updated or deleted by users.
 * Transactions are only created when a user makes a purchase (see {@link PaymentController}).
 */
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}

  @Get()
  findAll() {
    return this.transactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }

  @Get('user/:id')
  findAllForUser(@Param('id') id: number) {
    return this.transactionService.findAllForUser(id);
  }
}
