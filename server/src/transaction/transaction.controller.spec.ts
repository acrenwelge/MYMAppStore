import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionService } from './transaction.service';
import { ModuleMocker, MockFunctionMetadata } from 'jest-mock';

const moduleMocker = new ModuleMocker(global);


describe('TransactionController', () => {
  let controller: TransactionController;
  let provider: TransactionService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransactionController],
      providers: [TransactionService],
    // }).useMocker((token) => {
    //   const results = ['test1', 'test2'];
    //   console.log('token', token);
    //   if (token == TransactionService) {
    //     return {
    //       findAll: jest.fn().mockResolvedValue(results)
    //     };
    //   }
    //   if (typeof token == 'function') {
    //     const mockMetadata = moduleMocker.getMetadata(token) as MockFunctionMetadata<any, any>;
    //     const Mock = moduleMocker.generateFromMetadata(mockMetadata);
    //     return new Mock();
    //   }
    }).compile();

    controller = module.get<TransactionController>(TransactionController);
    provider = module.get<TransactionService>(TransactionService);
    
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  // describe('findAll', () => {
  //   it('should return an array of cats', async () => {
  //     const result = ['test1', 'test2'];
  //     jest.spyOn(provider, 'findAll').mockImplementation(() => result);

  //     expect(await controller.findAll()).toBe(result);
  //   });
  // });
});
