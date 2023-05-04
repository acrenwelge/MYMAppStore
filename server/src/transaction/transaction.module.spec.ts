import { Test } from '@nestjs/testing';
import { TransactionModule } from './transaction.module';

describe('TransactionModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [TransactionModule],
    }).compile();

    expect(module).toBeDefined();
  });
});