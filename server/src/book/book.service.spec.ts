import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import {EmailService} from "../email/email.service";
import {createMock} from "@golevelup/ts-jest";
import {getRepositoryToken} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {RecordService} from "../record/record.service";
import {EmailSubscriptionService} from "../email-subscription/email-subscription.service";


describe('BookService', () => {
  let service: BookService;
  let RecordService: RecordService;
  let EmailSubscriptionService: EmailSubscriptionService;


  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookService,

        {
          provide: BookService,
          useValue: createMock<BookService>(),
        },
        {
          //搞不定
          provide: RecordService,
          useValue: createMock<RecordService>(),
        },
        {
          provide: EmailSubscriptionService,
          useValue: createMock<EmailSubscriptionService>(),
        }
      ],
    }).compile();

    service = module.get<BookService>(BookService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
