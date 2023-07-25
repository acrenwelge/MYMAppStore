import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import {UserService} from "../user/user.service";
import {PurchaseCodeService} from '../purchaseCode/purchaseCode.service';
import { PurchaseCodeEntity } from 'src/purchaseCode/purchaseCode.entity';
import {TransactionService} from '../transaction/transaction.service';
import {EmailSubscriptionService} from "../email-subscription/email-subscription.service";
import {EmailSubscription} from "../email-subscription/email-subscription.entity";
import { createMock } from '@golevelup/ts-jest';
import { PurchaseCodeDto } from 'src/purchaseCode/purchaseCode.dto';

describe('AdminController', () => {
  let controller: AdminController;
  let usrservice: UserService;
  let prchservice: PurchaseCodeService;
  let transervice: TransactionService;
  let emsubservice: EmailSubscriptionService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AdminController],
      providers: [
        UserService,
        PurchaseCodeService,
        TransactionService,
        EmailSubscriptionService,
        {
          provide: UserService,
          useValue: createMock<UserService>(),
        },
        {
          provide: PurchaseCodeService,
          useValue: createMock<PurchaseCodeService>(),
        },
        {
          provide: TransactionService,
          useValue: createMock<TransactionService>(),
        },
        {
          provide: EmailSubscriptionService,
          useValue: createMock<EmailSubscriptionService>(),
        },
      ]
    }).compile();
    controller = module.get<AdminController>(AdminController);
    usrservice = module.get<UserService>(UserService);
    prchservice = module.get<PurchaseCodeService>(PurchaseCodeService);
    transervice = module.get<TransactionService>(TransactionService);
    emsubservice = module.get<EmailSubscriptionService>(EmailSubscriptionService);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calling findAllUser method', () => {
    controller.findAllUser();
    expect(usrservice.findAll).toHaveBeenCalled();
  });

  it('calling findAllTransaction method', () => {
    controller.findAllTransaction();
    expect(transervice.findAll).toHaveBeenCalled();
  });

  it('calling findAllPurchaseCode method', () => {
    controller.findAllPurchaseCode();
    expect(prchservice.findAll).toHaveBeenCalled();
  });

  it('calling delete-code method', () => {
    const testprchcode = new PurchaseCodeEntity();
    controller.deleteCode(testprchcode);
    expect(prchservice.deleteCode).toHaveBeenCalledWith(testprchcode.code_id);
  });

  it('calling update-code method', () => {
    const testprchcode: PurchaseCodeDto = {
      id: 1,
      name: 'test',
      priceOff: 10,
    }
    controller.updateCode(testprchcode);
    expect(prchservice.update).toHaveBeenCalledWith(testprchcode);
  });

  it('calling findAllEmailSub method', () => {
    controller.findAllEmailSub();
    expect(emsubservice.findAll).toHaveBeenCalled();
  });

  it('calling deleteEmailSub method', () => {
    const testemsub = new EmailSubscription();
    controller.deleteEmailSub(testemsub);
    expect(emsubservice.deleteEmailSub).toHaveBeenCalledWith(testemsub.email_sub_id);
  });

  it('calling updateEmailSub method', () => {
    const testemsub = new EmailSubscription();
    controller.updateEmailSub(testemsub);
    expect(emsubservice.updateEmailSub).toHaveBeenCalledWith(testemsub.email_sub_id, testemsub.suffix);
  });


});
