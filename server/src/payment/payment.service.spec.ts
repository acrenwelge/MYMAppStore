import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { SubscriptionService } from 'src/subscription/subscription.service';
import {TransactionService} from "../transaction/transaction.service";
import * as paypal from "./paypal-api";
import {createMock} from "@golevelup/ts-jest";

describe('PaymentService', () => {
  let service: PaymentService;
  let recservice: SubscriptionService;
  let transervice: TransactionService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          PaymentService,
        {
          provide: SubscriptionService,
          useValue: createMock<SubscriptionService>(),
        },
        {
          provide: TransactionService,
          useValue: createMock<TransactionService>(),
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    recservice = module.get<SubscriptionService>(SubscriptionService);
    transervice = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a transaction from purchase data after payment', async () => {
    // TODO: implement
  });

});
