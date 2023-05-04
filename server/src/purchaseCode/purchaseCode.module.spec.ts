import { Test } from '@nestjs/testing';
import { PurchaseCodeModule } from './purchaseCode.module';

describe('PurchaseCodeModule', () => {
  it('should compile the module', async () => {
    const module = await Test.createTestingModule({
      imports: [PurchaseCodeModule],
    }).compile();

    expect(module).toBeDefined();
  });
});