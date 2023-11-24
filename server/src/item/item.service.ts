import { Injectable, NotFoundException } from '@nestjs/common';
import { ItemDto } from './item.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import { ItemEntity } from './item.entity';
import { time } from 'console';

@Injectable()
export class ItemService {

  constructor(
    @InjectRepository(ItemEntity)
    private ItemRepo: Repository<ItemEntity>,
) {}

  convertToDto(ent: ItemEntity): ItemDto {
    const dto = new ItemDto();
    dto.itemId = ent.itemId;
    dto.name = ent.name;
    dto.price = ent.price;
    dto.subscriptionLengthMonths = ent.subscriptionLengthMonths;
    return dto;
  }

  async create(createItemDto: ItemDto) {
    const item = this.ItemRepo.create(createItemDto);
    return this.ItemRepo.save(item);
  }

  async findAll(): Promise<ItemDto[]> {
    const items = await this.ItemRepo.find()
    return items.map((item) => this.convertToDto(item));
  }

  async findOne(id: number): Promise<ItemDto | undefined> {
    const ent = await this.ItemRepo.findOne({where: {itemId: id}});
    return ent ? this.convertToDto(ent) : undefined;
  }

  async update(itemId: number, item: ItemDto): Promise<ItemDto> {
    const findItem = await this.ItemRepo.findOne({where: {itemId}});
    if (findItem === undefined) {
      throw new NotFoundException("Item doesn't exist!");
    }
    findItem.name = item.name;
    findItem.price = item.price;
    findItem.subscriptionLengthMonths = item.subscriptionLengthMonths
    await this.ItemRepo.save(findItem);
    if (findItem.itemId !== itemId) {
      await this.delete(itemId);
    }
    return Promise.resolve(this.convertToDto(findItem));
  }

  async delete(itemId: number): Promise<boolean> {
    const findItem = await this.ItemRepo.findOne({where: {itemId}});
    if (findItem != undefined) {
      await this.ItemRepo.remove(findItem);
      return Promise.resolve(true);
    } else {
      throw new NotFoundException("Product doesn't exist!");
    }
  }
  
}