import { Test, TestingModule } from '@nestjs/testing';
import { PaymentController } from './payment.controller';
import {PaymentService} from "./payment.service";
import {createMock} from "@golevelup/ts-jest";

describe('PaymentController', () => {
  let controller: PaymentController;
  let service: PaymentService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PaymentController],
      providers: [
        PaymentService,
        {
          provide: PaymentService,
          useValue: createMock<PaymentService>(),
        }
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

  /*Req part: */
});
