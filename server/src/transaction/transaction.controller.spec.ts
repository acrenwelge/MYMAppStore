import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { repositoryMockFactory } from './transaction.service.spec';
import { CreateTransactionDto } from './dto/create-transaction.dto';
import { UpdateTransactionDto } from './dto/update-transaction.dto';
import { Transaction } from './entities/transaction.entity';


describe('TransactionController', () => {
  let controller: TransactionController;
  let provider: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [
        TransactionService, 
        { 
          provide: TransactionService, 
          useFactory: repositoryMockFactory
        }
      ]
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    provider = module.get<TransactionService>(TransactionService);
    
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calling create method', () => {
    const dto: CreateTransactionDto = new CreateTransactionDto();
    controller.create(dto);
    expect(provider.create).toHaveBeenCalledWith(dto);
  });

  it('calling findOne method', () => {
    const id = '123';
    controller.findOne(id);
    expect(provider.findOne).toHaveBeenCalledWith(+id);
  });

  it('calling update method', () => {
    const id = "123";
    const trans = new Transaction();
    controller.update(id, trans);
    expect(provider.update).toBeCalledWith(trans.user_id, trans.item_id, trans.code_id, trans.price);
  });

  it('calling remove method', () => {
    const id = '123';
    controller.remove(id);
    expect(provider.remove).toHaveBeenCalledWith(+id);
  });

  it('calling findAll method', () => {
    controller.findAll();
    expect(provider.findAll).toHaveBeenCalled();
  });

});
