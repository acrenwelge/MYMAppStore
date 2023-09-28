import { createMock } from '@golevelup/ts-jest';
import { TransactionService } from './transaction.service';
import { Test, TestingModule } from '@nestjs/testing';
import { TransactionController } from './transaction.controller';
import { TransactionDto } from './transaction.dto';
import { TransactionDetailDto } from './transaction.dto';


describe('TransactionDTO', () => {
  let dto: TransactionDto;
  let deatilDto: TransactionDetailDto;

  beforeAll(async () => {
    const moduleDto: TestingModule = await Test.createTestingModule({
      controllers: [TransactionDto]
    }).compile();
    const moduleDetailDto: TestingModule = await Test.createTestingModule({
        controllers: [TransactionDetailDto]
      }).compile();

    dto = moduleDto.get<TransactionDto>(TransactionDto);
    deatilDto = moduleDetailDto.get<TransactionDetailDto>(TransactionDetailDto);
    
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(dto).toBeDefined();
    expect(deatilDto).toBeDefined();
  });

});
