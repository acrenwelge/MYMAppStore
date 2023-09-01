/* eslint-disable prettier/prettier */
import {Controller, Get, Post, Body, Param, HttpCode} from '@nestjs/common';
import { TransactionService } from './transaction.service';
import { TransactionDto } from './transaction.dto';

/**
 * @description Clients can send requests to create and find transactions.
 * Transactions are immutable and cannot be updated or deleted by users.
 */
@Controller('transaction')
export class TransactionController {
  constructor(private readonly transactionService: TransactionService) {}
  @HttpCode(200)
  @Post()
  create(@Body() createTransactionDto: TransactionDto) {
    return this.transactionService.create(createTransactionDto);
  }

  @Get()
  findAll() {
    return this.transactionService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.transactionService.findOne(+id);
  }
}
