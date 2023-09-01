import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { SubscriptionService } from 'src/subscription/subscription.service';
import {TransactionService} from "../transaction/transaction.service";
import * as paypal from "./paypal-api";
import {EmailService} from "../email/email.service";
import {createMock} from "@golevelup/ts-jest";
import {CreateTransactionDto} from "../transaction/transaction.dto";
import {SubscriptionEntity} from "../subscription/subscription.entity";
import {TransactionEntity} from "../transaction/entities/transaction.entity";

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

/* create : request*/

/* capture: request */

  it('should finish purchasing and sync purchase information', async () => {
    const userid = 1;
    const codeid = 1;
    const itemid = 1;
    const price = 1;
    const recordResult = new SubscriptionEntity();
    const transactionResult = new TransactionEntity();
    jest.spyOn(recservice, 'update').mockImplementation(async () => recordResult);
    jest.spyOn(transervice, 'update').mockImplementation(async () => transactionResult);
    expect(await service.recordPurchase(userid, codeid, itemid, price)).toEqual({recordResult, transactionResult});
  });



});
