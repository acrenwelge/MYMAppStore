import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import {PaymentService} from "./payment.service";
import {createMock} from "@golevelup/ts-jest";
import { createRequest } from 'node-mocks-http';
import { createResponse} from 'node-mocks-http';
import {Transaction} from "../transaction/entities/transaction.entity";


describe('PaymentController', () => {
  let controller: PaymentController;
  let service: PaymentService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
          PaymentService,
        {
           provide: PaymentService,
           useValue: createMock<PaymentService>(),
        },
      ]
    }).compile();

    controller = module.get<PaymentController>(PaymentController);
    service = module.get<PaymentService>(PaymentService);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('should create', () => {
    //const req = createRequest(100);
    //const req = createRequest({});
    const req = new Request("https://www.aa.com");
    const res = createResponse({});
    controller.create(req, res);
    expect(res.statusCode).toBe(200);
  });

  it('should capture', () => {
    //const req = createRequest({});
    const req = new Request("https://www.aa.com");
    const res = createResponse({});
    controller.capture(req, res);
    expect(res.statusCode).toBe(200);
  });

  it('should finish purchasing', () => {
    const req = createRequest({
      user: {
        user_id: 1,
      }
    });
    const temp = new Transaction();
    controller.finishPurchasing(req, temp);
    expect(service.finishPurchasing).toBeCalledTimes(1);
  });


});