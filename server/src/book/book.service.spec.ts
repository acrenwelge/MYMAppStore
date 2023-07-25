import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import {createMock} from "@golevelup/ts-jest";
import {RecordService} from "../record/record.service";
import {EmailSubscriptionService} from "../email-subscription/email-subscription.service";
import { UserService } from 'src/user/user.service';
import { User } from 'src/user/entities/user.entity';
import { ForbiddenException } from '@nestjs/common';

describe('BookService', () => {
  let service: BookService;
  let recordService: RecordService;
  let emailSubscriptionService: EmailSubscriptionService;
  let userService: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookService,
        {
          provide: RecordService,
          useValue: createMock<RecordService>(),
        },
        {
          provide: EmailSubscriptionService,
          useValue: createMock<EmailSubscriptionService>(),
        },
        {
          provide: UserService,
          useValue: createMock<UserService>(),
        }
      ],
    }).compile();
    service = module.get<BookService>(BookService);
    recordService = module.get<RecordService>(RecordService);
    emailSubscriptionService = module.get<EmailSubscriptionService>(EmailSubscriptionService);
    userService = module.get<UserService>(UserService);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it ('should allow A&M users to access any book', async () => {
    jest.spyOn(userService, 'findOneById').mockImplementation(async () => {
      let user = new User();
      user.email = "abc@tamu.edu"
      return user;
    });
    jest.spyOn(recordService, 'checkIfUserPurchaseItem').mockImplementation(async () => false);
    jest.spyOn(emailSubscriptionService, 'checkIfUserEmailSubItem').mockImplementation(async () => false);
    expect(await service.getBookURL(1,"dummyValue")).toStrictEqual(
      {bookURL: process.env.BOOK_ROOT_PATH,
      ifPurchase: false,
      ifEmailSub: false});
  });

  xit ('should not allow unauthorized users to access any book', async () => {
    jest.spyOn(userService, 'findOneById').mockImplementation(async () => {
      let user = new User();
      user.email = "abc@otherschool.com"
      return user;
    });
    jest.spyOn(recordService, 'checkIfUserPurchaseItem').mockImplementation(async () => false);
    jest.spyOn(emailSubscriptionService, 'checkIfUserEmailSubItem').mockImplementation(async () => false);
    expect(service.getBookURL(1,"dummyValue")).toThrowError(ForbiddenException);
  });

});