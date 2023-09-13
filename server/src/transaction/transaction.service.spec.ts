import { TransactionService } from './transaction.service';
import { TransactionEntity } from "./entities/transaction.entity";
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMock } from '@golevelup/ts-jest';
import Cart from 'src/payment/payment.entity';

type MockType<T> = {
  [P in keyof T]: jest.Mock<{}>;
};

describe('TransactionService', () => {
  let service: TransactionService;
  let repositoryMock: MockType<Repository<TransactionEntity>>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TransactionService,
        {
          provide: getRepositoryToken(TransactionEntity),
          useValue: createMock<TransactionEntity>(),
        }
      ],
    }).compile();

    service = module.get<TransactionService>(TransactionService);
    repositoryMock = module.get(getRepositoryToken(TransactionEntity));

  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should fine one transaction', async () => {
    const result = new TransactionEntity();
    result.txId = 123;
    jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => result);
    expect(await service.findOne(123)).toBe(result);
  });

  it('should find all transactions', async () => {
    jest.spyOn(repositoryMock, 'find').mockImplementation(() => true);
    expect(await service.findAll()).toBe(true);
  });

  it('should create a transaction from purchase data', async () => {
    const cart: Cart = {
      purchaserUserId: 1,
      grandTotal: 10,
      items: [
        {
          itemId: 1,
          quantity: 1,
          purchaseCode: "ABC",
        },
        {
          itemId: 1,
          quantity: 1,
          purchaseCode: "ABC",
        }
      ]
    }
    jest.spyOn(repositoryMock, 'save').mockImplementation(() => true);
    expect(await service.createAndSaveFromPurchaseCart(cart)).toBe(true);
  });

});