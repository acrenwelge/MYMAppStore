import { Injectable, NotFoundException } from '@nestjs/common';
import { ItemDto } from './item.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {Repository} from "typeorm";
import { ItemEntity } from './item.entity';

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

  async findAll() {
    const items = await this.ItemRepo.find()
    return items.map((item) => this.convertToDto(item));
  }

  async findOne(id: number): Promise<ItemDto | undefined> {
    const ent = await this.ItemRepo.findOne({where: {itemId: id}});
    return ent ? this.convertToDto(ent) : undefined;
  }

  async update(id: number, updateItemDto: ItemDto) {
    const itemEnt = await this.ItemRepo.findOne({where: {itemId: id}});
    if (itemEnt) {
      return this.ItemRepo.save(itemEnt);
    } else {
      throw new NotFoundException("Item could not be updated; Item not found");
    }
  }

  async remove(id: number) {
    const itemEnt = await this.ItemRepo.findOne({where: {itemId: id}});
    if (itemEnt) {
      return this.ItemRepo.remove(itemEnt);
    } else {
      throw new NotFoundException("Item could not be deleted; Item not found");
    }
  }
}
