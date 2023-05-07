import { Test, TestingModule } from '@nestjs/testing';
import { AdminController } from './admin.controller';
import {UserService} from "../user/user.service";
import {PurchaseCodeService} from '../purchaseCode/purchaseCode.service';
import { PurchaseCode } from 'src/purchaseCode/purchaseCode.entity';
import {TransactionService} from '../transaction/transaction.service';
import {EmailSubscriptionService} from "../email-subscription/email-subscription.service";
import {EmailSubscription} from "../email-subscription/email-subscription.entity";
import { createMock } from '@golevelup/ts-jest';
import {getRepositoryToken} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {EmailService} from "../email/email.service";



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

    // console.log(controller);

  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calling findAllUser method', () => {
    //console.log('it')
    //console.log(controller)

    controller.findAllUser();
    //console.log(usrservice)
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
    const testprchcode = new PurchaseCode();
    controller.deleteCode(testprchcode);
    expect(prchservice.deleteCode).toHaveBeenCalledWith(testprchcode.code_id);
  });

  it('calling update-code method', () => {
    const testprchcode = new PurchaseCode();
    controller.updateCode(testprchcode);
    expect(prchservice.updateCode).toHaveBeenCalledWith(testprchcode.code_id, testprchcode.priceOff);
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
