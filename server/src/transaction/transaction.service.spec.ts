import { TransactionService } from './transaction.service';
import { Transaction } from "./entities/transaction.entity";
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateTransactionDto } from './dto/create-transaction.dto';


describe('TransactionService', () => {
  let service: TransactionService;
  let repositoryMock: MockType<Repository<Transaction>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(Transaction),
          useFactory: repositoryMockFactory,
        }
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    repositoryMock = module.get(getRepositoryToken(Transaction));

  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fine one transaction', async () => {
    const result = new Transaction();
    result.id = 123;
    jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => result);
    expect(await service.findOne(123)).toBe(result);
  });

  it('should remove a transaction', async () => {
    const id = 123;
    const msg = `This action removes a #${id} transaction`;
    jest.spyOn(repositoryMock, 'remove').mockImplementation(() => true);
    expect(await service.remove(id)).toBe(msg);
  });

  it('should find all transactions', async () => {
    jest.spyOn(repositoryMock, 'find').mockImplementation(() => true);
    expect(await service.findAll()).toBe(true);
  });

  it('should create a transaction', async () => {
    const trans = new CreateTransactionDto();
    jest.spyOn(repositoryMock, 'save').mockImplementation(() => true);
    expect(await service.create(trans)).toBe(true);
  });

  it('should update a transaction', async () => {
    const trans = new Transaction();
    jest.spyOn(repositoryMock, 'save').mockImplementation(() => true);
    expect(await service.update(trans.user_id, trans.item_id, trans.code_id, trans.price)).toBe(true);
  });

});


// @ts-ignore
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => ({
  findOne: jest.fn(),
  find: jest.fn(),
  save: jest.fn(),
  remove: jest.fn()
}));

export type MockType<T> = {
  [P in keyof T]: jest.Mock<{}>;
};
