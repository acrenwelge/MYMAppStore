import { Injectable, NotFoundException } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {PurchaseCodeEntity} from "./purchaseCode.entity";
import {Repository} from "typeorm";
import { ConflictException } from '@nestjs/common';
import { PurchaseCodeDto } from './purchaseCode.dto';

@Injectable()
export class PurchaseCodeService {

  constructor(
      @InjectRepository(PurchaseCodeEntity)
      private purchaseCodeRepo: Repository<PurchaseCodeEntity>,  // 使用泛型注入对应类型的存储库实例
  ) {}

  create(createPurchaseCode: PurchaseCodeEntity) {
    //ToDO if user already exist
    return this.purchaseCodeRepo.save(createPurchaseCode)
  }

  async findAll() {
    const purchaseCodes = await this.purchaseCodeRepo.find({
      select:{
        code_id: true,
        name: true,
        priceOff: true
      }
    })
    return purchaseCodes
  }

  async findOne(code_id: number): Promise<PurchaseCodeEntity> {
    const purchaseCode = await this.purchaseCodeRepo.findOne({where: {code_id}});
    if (purchaseCode == null){
      throw new NotFoundException("Purchase code doesn't exist!");
    }
    return Promise.resolve(purchaseCode);
  }

  async addOne(name: string, priceOff: number): Promise<PurchaseCodeEntity> {
    const newCode = new PurchaseCodeEntity();
    newCode.name = name;
    newCode.priceOff = priceOff;
    const oldCode = await this.purchaseCodeRepo.findOne({where: {name}});
    if (oldCode === null) {
      const purchaseCode = await this.purchaseCodeRepo.save(newCode);
      return purchaseCode;
    } else {
      throw new ConflictException("Purchase code already exist!");
    }
  }

  async deleteCode(code_id: number): Promise<PurchaseCodeEntity>{
    const findCode = await this.purchaseCodeRepo.findOne({where: {code_id}});
    if (findCode != null) {
      await this.purchaseCodeRepo.remove(findCode);
      return findCode;
    } else {
      throw new ConflictException("Purchase code doesn't exist!");
    }
  }

  async validateCode(name:string): Promise<PurchaseCodeEntity>{
    const findCode = await this.purchaseCodeRepo.findOne({where: {name}});
    if (findCode != null) {
      return findCode;
    } else {
      throw new ConflictException("Purchase code doesn't exist!");
    }
  }

  async update(code: PurchaseCodeDto): Promise<PurchaseCodeEntity> {
    const code_id = code.id;
    const findCode = await this.purchaseCodeRepo.findOne({where: {code_id}});
    if (findCode === null) {
      throw new NotFoundException("Purchase code doesn't exist!");
    }
    findCode.priceOff = code.priceOff;
    findCode.name = code.name;
    await this.purchaseCodeRepo.save(findCode);
    return Promise.resolve(findCode);
  }

}