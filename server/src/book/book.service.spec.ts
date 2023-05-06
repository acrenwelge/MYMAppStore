import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from './book.service';
import {createMock} from "@golevelup/ts-jest";
import {getRepositoryToken} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {RecordService} from "../record/record.service";
import {EmailSubscriptionService} from "../email-subscription/email-subscription.service";
import * as path from 'path';
import * as fs from 'fs';

describe('BookService', () => {
  let service: BookService;
  let recordService: RecordService;
  let emailSubscriptionService: EmailSubscriptionService;


  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookService,

        {
          //为什么跑不动
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
    recordService = module.get<RecordService>(RecordService);
    emailSubscriptionService = module.get<EmailSubscriptionService>(EmailSubscriptionService);

  });


  afterAll(() => {
    jest.clearAllMocks();
  });

  //
  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  //
  // it('get a book content', async () => {
  //   //const book = await service.getBookContent();
  //   const appDirectory = process.cwd();
  //   const bookpath = "";
  //   const result = Promise<string>;
  //   jest.spyOn(path, 'resolve').mockImplementation(() => bookpath);
  //   jest.spyOn(fs.promises, 'readFile').mockImplementation(() => result);
  //
  //   expect(await service.getBookContent()).toBe(result);
  //
  // })

  //GetBookURL
  it ('get a book url', async () => {

      //const book = await service.getBookURL();
    const ifPurchase = true;
    const ifEmail = true;
    jest.spyOn(recordService, 'checkIfUserPurchaseItem').mockImplementation(async () => true);
    jest.spyOn(emailSubscriptionService, 'checkIfUserEmailSubItem').mockImplementation(async () => true);
    expect(await service.getBookURL(1,"hi", "hi@hi")).toStrictEqual({bookURL: process.env.BOOK_ROOT_PATH,
      ifPurchase:ifPurchase,
      ifEmailSub:ifEmail});
  });

  /*
  sync getBookContent() {
        const appDirectory = process.cwd();
        const bookPath = path.resolve(appDirectory,"src","book","bookContent","index.html")

        const fileContent = await fs.promises.readFile(bookPath, 'utf-8');
       return fileContent
    }
   */

});
