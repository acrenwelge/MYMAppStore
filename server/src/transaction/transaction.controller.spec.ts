import { createMock } from '@golevelup/ts-jest';
import { TransactionService } from './transaction.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';


describe('TransactionController', () => {
  let controller: TransactionController;
  let service: TransactionService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        TransactionService, 
        { 
          provide: TransactionService, 
          useValue: createMock<TransactionService>(),
        }
      ]
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    service = module.get<TransactionService>(TransactionService);
    
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  //

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calling findOne method', () => {
    const id = '123';
    controller.findOne(id);
    expect(service.findOne).toHaveBeenCalledWith(+id);
  });

  it('calling findAll method', () => {
    controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

});
