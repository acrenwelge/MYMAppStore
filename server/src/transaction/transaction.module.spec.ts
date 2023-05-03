import { Test } from '@nestjs/testing';
import { TransactionModule } from './transaction.module';
// import { ThingsResolver } from './things.resolver';
// import { ThingsService } from './things.service';

describe('TransactionModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [TransactionModule],
    }).compile();

    expect(module).toBeDefined();
    // expect(module.get(ThingsResolver)).toBeInstanceOf(ThingsResolver);
    // expect(module.get(ThingsService)).toBeInstanceOf(ThingsService);
  });
});