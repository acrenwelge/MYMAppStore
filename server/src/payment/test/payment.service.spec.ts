import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from '../payment.service';
import { SubscriptionService } from 'src/subscription/subscription.service';
import {TransactionService} from "../../transaction/transaction.service";
import { createResponse} from 'node-mocks-http';
import Cart, { PayPalOrderDetails, PaypalCreateOrderResponse } from '../payment.entity';
import * as paypal from "../paypal-api";
import {createMock} from "@golevelup/ts-jest";
import { TransactionEntity } from 'src/transaction/entities/transaction.entity';

describe('PaymentService', () => {
  let service: PaymentService;
  let transervice: TransactionService;
  const cartData:Cart = {
    purchaserUserId: 12345,
    grandTotal: 500.0,
    hasAccessUserId: 12345,
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

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a paypal order', async () => {
    const res = createResponse({});
    const mock = jest.spyOn(paypal, 'createOrder');
    mock.mockImplementation(async (grandTotal) => {
      // Return a mock response
          return {
             id: "1",
            status: "SUCCESS",
            links: [{
              href: "sample link",
              rel: "text",
              method: "POST",
          }],
          };
      });
    await service.createPaypalOrder(cartData, res);
    expect(res.statusCode).toBe(200);
  });

  it('should not create a paypal order', async () => {
    const res = createResponse({});
    const mock = jest.spyOn(paypal, 'createOrder');
    mock.mockImplementation(async (grandTotal) => {
      // Return a mock response
          throw new Error("Could not make payment");
      });
    await service.createPaypalOrder(cartData, res);
    expect(res.statusCode).toBe(500);
  });

  it('should create a transaction from purchase data after payment', async () => {
    const orderDetails:PayPalOrderDetails = {
      orderId: "1",
      cart: cartData,
      recipientIds: [10]
    };
    const res = createResponse({});
    const result = new TransactionEntity();
    jest.spyOn(paypal, 'capturePayment').mockImplementation(async(orderId) => {});
    jest.spyOn(transervice, 'createAndSaveFromPurchaseCart').mockImplementation(async(cartData) => {return result});
    await service.captureAndRecordTx(orderDetails, res);
    expect(res.statusCode).toBe(200);
  });

  it('should not create a transaction from purchase data after payment', async () => {
    const orderDetails:PayPalOrderDetails = {
      orderId: "1",
      cart: cartData
    };
    const res = createResponse({});
    const result = new TransactionEntity();
    jest.spyOn(paypal, 'capturePayment').mockImplementation(async(orderId) => {
            // Return a mock response
            throw new Error("Could not capture payment");
    });
    await service.captureAndRecordTx(orderDetails, res);
    expect(res.statusCode).toBe(500);
  });

});
