import { Module } from '@nestjs/common';
import { ItemService } from './item.service';
import { ItemController } from './item.controller';
import { ItemEntity} from './item.entity'
import {TypeOrmModule} from "@nestjs/typeorm";
@Module({
  imports:[TypeOrmModule.forFeature([ItemEntity])],
  controllers: [ItemController],
  providers: [ItemService]
})
export class ItemModule {}
