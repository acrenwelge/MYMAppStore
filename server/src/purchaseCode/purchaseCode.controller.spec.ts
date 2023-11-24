import { createMock } from '@golevelup/ts-jest';
import { Test, TestingModule } from '@nestjs/testing';
import { HttpStatus, INestApplication } from '@nestjs/common';
import * as request from 'supertest';
import { PurchaseCodeController } from './purchaseCode.controller';
import { PurchaseCodeService } from './purchaseCode.service';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { AuthGuard } from '@nestjs/passport';
import { PurchaseCodeDto } from './purchaseCode.dto';

describe('PurchaseCodeController', () => {
    let controller: PurchaseCodeController;
    let service: PurchaseCodeService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
        controllers: [PurchaseCodeController],
        providers: [
            PurchaseCodeService, 
            { 
            provide: PurchaseCodeService, 
            useValue: createMock<PurchaseCodeService>(),
            }
        ]
        }).compile();

        controller = module.get<PurchaseCodeController>(PurchaseCodeController);
        service = module.get<PurchaseCodeService>(PurchaseCodeService);
        
    });

  afterAll(async () => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calling create method', () => {
    const testItem = new PurchaseCodeDto();
    controller.addPurchaseCode(testItem);
    expect(service.createOne).toHaveBeenCalled();
  });

  it('calling findOne method', () => {
    const name = 'code';
    controller.getOnePurchaseCode(name);
    expect(service.findOne).toHaveBeenCalledWith(name);
  });

  it('calling findAll method', () => {
    controller.getAllPurchaseCodes();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('calling validate method', () => {
    controller.checkValidPurchaseCode({name: 'code', itemId: 1});
    expect(service.validateCode).toHaveBeenCalled();
  });

  it('calling update method', () => {
    const name = 'code';
    const testItem = new PurchaseCodeDto();
    controller.updatePurchaseCode(name, testItem);
    expect(service.update).toHaveBeenCalled();
  });

  it('calling remove method', () => {
    const name = 'code';
    controller.deleteCode(name);
    expect(service.update).toHaveBeenCalled();
  });
});
