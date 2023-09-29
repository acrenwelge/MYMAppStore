import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from '../payment.service';
import { SubscriptionService } from 'src/subscription/subscription.service';
import {TransactionService} from "../../transaction/transaction.service";
import { createResponse} from 'node-mocks-http';
import Cart, { PayPalOrderDetails } from '../payment.entity';
import * as paypal from "../paypal-api";
import {createMock} from "@golevelup/ts-jest";

describe('PaymentService', () => {
  let service: PaymentService;
  let transervice: TransactionService;
  const cartData:Cart = {
    purchaserUserId: 12345,
    grandTotal: 500.0,
    items: [
      {
        itemId: 1,
        finalPrice: 100.0,
        quantity: 2,
        purchaseCode: "ABC123",
      },
      {
        itemId: 2,
        finalPrice: 200.0,
      },
    ],
  };

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
    transervice = module.get<TransactionService>(TransactionService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a paypal order', async () => {
    const res = createResponse({});
    service.createPaypalOrder(cartData, res);
    expect(res.statusCode).toBe(200);
  });

  it('should create a transaction from purchase data after payment', async () => {
    const orderDetails:PayPalOrderDetails = {
      orderId: "1",
      cart: cartData
    };
    const res = createResponse({});
    service.captureAndRecordTx(orderDetails, res);
    expect(res.statusCode).toBe(200);
  });

});
