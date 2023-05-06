import { createMock } from '@golevelup/ts-jest';
import { PurchaseCodeService } from './purchaseCode.service';
import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseCodeController } from './purchaseCode.controller';
//import { CreateTransactionDto } from './dto/create-transaction.dto';
import { PurchaseCode } from './purchaseCode.entity';


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

  it('calling findAll method', () => {
    controller.findAllUser();
    expect(service.findAll).toHaveBeenCalled();
  });


  it('calling findOne method', () => {
    const id = 1;
    controller.findOne(id);
    expect(service.findOne).toHaveBeenCalledWith(id);
  });

  it('calling validate method', () => {
    const name = "AAA";
    controller.checkValidPurchaseCode(name);
    expect(service.validateCode).toHaveBeenCalledWith(name);
  });

});
