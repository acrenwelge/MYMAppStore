import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { RecordService } from 'src/record/record.service';
import {TransactionService} from "../transaction/transaction.service";
import * as paypal from "./paypal-api";
import {EmailService} from "../email/email.service";
import {createMock} from "@golevelup/ts-jest";
import {CreateTransactionDto} from "../transaction/dto/create-transaction.dto";
import {Record} from "../record/entities/record.entity";
import {Transaction} from "../transaction/entities/transaction.entity";



describe('PaymentService', () => {
  let service: PaymentService;
  let recservice: RecordService;
  let transervice: TransactionService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          PaymentService,
        {
          provide: RecordService,
          useValue: createMock<RecordService>(),
        },
        {
          provide: TransactionService,
          useValue: createMock<TransactionService>(),
        },
      ],
    }).compile();

    service = module.get<PaymentService>(PaymentService);
    recservice = module.get<RecordService>(RecordService);
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
    const recordResult = new Record();
    const transactionResult = new Transaction();
    jest.spyOn(recservice, 'update').mockImplementation(async () => recordResult);
    jest.spyOn(transervice, 'update').mockImplementation(async () => transactionResult);
    expect(await service.finishPurchasing(userid, codeid, itemid, price)).toEqual({recordResult, transactionResult});
  });



});
