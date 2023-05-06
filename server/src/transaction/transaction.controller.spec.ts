import { createMock } from '@golevelup/ts-jest';
import { TransactionService } from './transaction.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { Transaction } from './entities/transaction.entity';


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

  //

  it('calling create method', () => {
    const dto: CreateTransactionDto = new CreateTransactionDto();
    controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('calling findOne method', () => {
    const id = '123';
    controller.findOne(id);
    expect(service.findOne).toHaveBeenCalledWith(+id);
  });

  it('calling update method', () => {
    const id = "123";
    const trans = new Transaction();
    controller.update(id, trans);
    expect(service.update).toBeCalledWith(trans.user_id, trans.item_id, trans.code_id, trans.price);
  });

  it('calling remove method', () => {
    const id = '123';
    controller.remove(id);
    expect(service.remove).toHaveBeenCalledWith(+id);
  });

  it('calling findAll method', () => {
    controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

});
