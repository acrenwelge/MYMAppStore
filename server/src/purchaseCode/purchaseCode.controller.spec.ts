import { createMock } from '@golevelup/ts-jest';
import { PurchaseCodeService } from './purchaseCode.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseCodeController } from './purchaseCode.controller';

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

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should return all purchase codes', () => {
    controller.getAllPurchaseCodes();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('should get a purchase code by id', () => {
    const id = 1;
    controller.getOnePurchaseCode(id);
    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  it('should validate a purchase code', () => {
    const name = "AAA";
    controller.checkValidPurchaseCode(name);
    expect(service.validateCode).toHaveBeenCalledWith(name);
  });

});
