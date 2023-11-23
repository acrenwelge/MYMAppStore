import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from '../payment.controller';
import {PaymentService} from "../payment.service";
import {createMock} from "@golevelup/ts-jest";
import { createResponse} from 'node-mocks-http';
import Cart from '../payment.entity';
import { PayPalOrderDetails } from '../payment.entity';
import { SubscriptionService } from 'src/subscription/subscription.service';


describe('PaymentController', () => {
  let controller: PaymentController;
  let paymentService: PaymentService;
  let subscriptionService: SubscriptionService;
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
      controllers: [PaymentController],
      providers: [
          PaymentService,
          SubscriptionService,
        {
           provide: PaymentService,
           useValue: createMock<PaymentService>(),
        },
        {
          provide: SubscriptionService,
          useValue: createMock<SubscriptionService>(),
        },
      ]
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
    paymentService = module.get<PaymentService>(PaymentService);
    subscriptionService = module.get<SubscriptionService>(SubscriptionService);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create oder', () => {
    const res = createResponse({});
    controller.create(cartData, res);
    expect(res.statusCode).toBe(200);
  });

  it('should capture order', () => {
    const orderDetails:PayPalOrderDetails = {
      orderId: "1",
      cart: cartData,
      recipientIds: [1]
    };
    const res = createResponse({});
    controller.capture(orderDetails, res);
    expect(res.statusCode).toBe(200);
  });

});