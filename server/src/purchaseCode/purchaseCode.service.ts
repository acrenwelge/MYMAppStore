import { Injectable, NotFoundException } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {PurchaseCodeEntity} from "./purchaseCode.entity";
import {Repository} from "typeorm";
import { ConflictException } from '@nestjs/common';
import { PurchaseCodeDto } from './purchaseCode.dto';
import { ItemEntity } from 'src/item/item.entity';
import { ItemService } from 'src/item/item.service';

@Injectable()
export class PurchaseCodeService {

  constructor(
      @InjectRepository(PurchaseCodeEntity) private purchaseCodeRepo: Repository<PurchaseCodeEntity>,
      @InjectRepository(ItemEntity) private itemRepo: Repository<ItemEntity>,
  ) {}

  private convertToDto(purchaseCode: PurchaseCodeEntity): PurchaseCodeDto {
    let res = new PurchaseCodeDto();
    res.codeId = purchaseCode.code_id;
    res.name = purchaseCode.name;
    res.item = {
      itemId: purchaseCode.item.itemId,
      itemName: purchaseCode.item.name
    }
    res.priceOff = purchaseCode.priceOff;
    return res;
  }

  async findAll(): Promise<PurchaseCodeDto[]> {
    const entities = await this.purchaseCodeRepo.find();
    return entities.map(purchaseCode => this.convertToDto(purchaseCode));
  }

  async findOne(code_id: number): Promise<PurchaseCodeDto> {
    const purchaseCode = await this.purchaseCodeRepo.findOne({where: {code_id}});
    if (purchaseCode == null){
      throw new NotFoundException("Purchase code doesn't exist!");
    }
    return Promise.resolve(this.convertToDto(purchaseCode));
  }

  // adds new purchase code and links to item if code name does not already exist
  async addOne(codeToAdd: PurchaseCodeDto): Promise<PurchaseCodeDto> {
    const existsAlready = this.purchaseCodeRepo.exist({ where: {name: codeToAdd.name}});
    if (!existsAlready) {
      const newCode = new PurchaseCodeEntity();
      newCode.name = codeToAdd.name;
      newCode.priceOff = codeToAdd.priceOff;
      newCode.item = await this.itemRepo.findOne({where: {itemId: codeToAdd.item.itemId}});
      const purchaseCode = await this.purchaseCodeRepo.save(newCode);
      return this.convertToDto(purchaseCode);
    } else {
      throw new ConflictException("Purchase code name already exists!");
    }
  }

  async deleteCode(code_id: number): Promise<PurchaseCodeDto>{
    const findCode = await this.purchaseCodeRepo.findOne({where: {code_id}});
    if (findCode != null) {
      await this.purchaseCodeRepo.remove(findCode);
      return Promise.resolve(this.convertToDto(findCode));
    } else {
      throw new ConflictException("Purchase code doesn't exist!");
    }
  }

  async validateCode(name:string): Promise<PurchaseCodeDto>{
    const findCode = await this.purchaseCodeRepo.findOne({where: {name}});
    if (findCode != null) {
      return Promise.resolve(this.convertToDto(findCode));
    } else {
      return Promise.reject("Purchase code doesn't exist!");
    }
  }

  async update(code: PurchaseCodeDto): Promise<PurchaseCodeDto> {
    const findCode = await this.purchaseCodeRepo.findOne({where: {code_id: code.codeId}});
    if (findCode === null) {
      throw new NotFoundException("Purchase code doesn't exist!");
    }
    findCode.priceOff = code.priceOff;
    findCode.name = code.name;
    findCode.item = await this.itemRepo.findOne({where: {itemId: code.item.itemId}});
    if (findCode.item === null) {
      throw new NotFoundException("Item for the purchase code does not exist!");
    }
    await this.purchaseCodeRepo.save(findCode);
    return Promise.resolve(this.convertToDto(findCode));
  }

}