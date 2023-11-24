import { Injectable, NotFoundException } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {PurchaseCodeEntity} from "./purchaseCode.entity";
import {Repository} from "typeorm";
import { ConflictException } from '@nestjs/common';
import { PurchaseCodeDto, PurchaseCodeFormValues } from './purchaseCode.dto';
import { ItemEntity } from 'src/item/item.entity';

@Injectable()
export class PurchaseCodeService {

  constructor(
      @InjectRepository(PurchaseCodeEntity) private purchaseCodeRepo: Repository<PurchaseCodeEntity>,
      @InjectRepository(ItemEntity) private itemRepo: Repository<ItemEntity>,
  ) {}

  convertToDto(purchaseCode: PurchaseCodeEntity): PurchaseCodeDto {
    let res = new PurchaseCodeDto();
    res.name = purchaseCode.name;
    res.item = {
      itemId: purchaseCode.item.itemId,
      itemName: purchaseCode.item.name,
      itemSubscriptionLength: purchaseCode.item.subscriptionLengthMonths
    }
    res.priceOff = purchaseCode.salePrice;
    return res;
  }

  async findAll(): Promise<PurchaseCodeDto[]> {
    const entities = await this.purchaseCodeRepo.find({
      relations: ["item"]
    });
    return entities.map(purchaseCode => this.convertToDto(purchaseCode));
  }

  async findOne(name: string): Promise<PurchaseCodeDto> {
    const purchaseCode = await this.purchaseCodeRepo.findOne({
      relations: ["item"],
      where: {name}
    });
    if (purchaseCode == null) {
      throw new NotFoundException("Purchase code doesn't exist!");
    }
    return Promise.resolve(this.convertToDto(purchaseCode));
  }

  // adds new purchase code and links to item if code name does not already exist
  async createOne(codeToAdd: PurchaseCodeFormValues): Promise<PurchaseCodeDto> {
    const existsAlready = await this.purchaseCodeRepo.exist({ where: {name: codeToAdd.name}});
    if (!existsAlready) {
      const newCode = new PurchaseCodeEntity();
      newCode.name = codeToAdd.name;
      newCode.salePrice = codeToAdd.priceOff;
      newCode.item = await this.itemRepo.findOne({where: {itemId: codeToAdd.itemId}});
      const purchaseCode = await this.purchaseCodeRepo.save(newCode);
      return this.convertToDto(purchaseCode);
    } else {
      throw new ConflictException("Purchase code name already exists!");
    }
  }

  async deleteCode(name: string): Promise<boolean> {
    const findCode = await this.purchaseCodeRepo.findOne({where: {name}});
    if (findCode != null) {
      await this.purchaseCodeRepo.remove(findCode);
      return Promise.resolve(true);
    } else {
      throw new NotFoundException("Purchase code doesn't exist!"); 
    }
  }

  /**
   * Validates a purchase code by checking if it exists and if it is linked to the correct item
   * @param name for the purchase code
   * @param itemId of the item to check against
   * @returns a Promise of a PurchaseCodeDto if the code is valid, otherwise rejects with an error message
   */
  async validateCode(name: string, itemId: number): Promise<PurchaseCodeDto> {
    const findCode = await this.purchaseCodeRepo.findOne({
      relations: ["item"],
      where: {name}
    });
    if (findCode != null && findCode.item.itemId === itemId) {
      return Promise.resolve(this.convertToDto(findCode));
    } else {
      throw new NotFoundException("Purchase code Item doesn't exist!"); 
    }
  }

  /**
   * Because the purchase code name is the primary key, updating it actually means deleting the old code and creating a new one
   * @param name of existing code to change
   * @param code new code to replace the old one
   * @returns 
   */
  async update(name: string, code: PurchaseCodeDto): Promise<PurchaseCodeDto> {
    console.log("updating purchase code:", code);
    const findCode = await this.purchaseCodeRepo.findOne({where: {name}});
    if (findCode === null) {
      throw new NotFoundException("Purchase code doesn't exist!");
    }
    findCode.salePrice = code.priceOff;
    findCode.name = code.name;
    const itemId = findCode.item?.itemId;
    findCode.item = await this.itemRepo.findOne({where: {itemId: itemId}});
    if (findCode.item === null) {
      throw new NotFoundException("Item for the purchase code does not exist!");
    }
    await this.purchaseCodeRepo.save(findCode);
    if (findCode.name !== name) {
      await this.deleteCode(name);
    }
    return Promise.resolve(this.convertToDto(findCode));
  }

}