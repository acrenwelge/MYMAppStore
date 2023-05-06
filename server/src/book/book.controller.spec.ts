import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import {TransactionService} from "../transaction/transaction.service";
import {BookService} from "./book.service";
import {async} from "rxjs";
import {CreateTransactionDto} from "../transaction/dto/create-transaction.dto";
import { createMock } from '@golevelup/ts-jest';
import { createRequest } from 'node-mocks-http';

describe('BookController', () => {
  let controller: BookController;
  let service: BookService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [BookService,
        {
        provide: BookService,
        useValue: createMock<BookService>(),
        }
      ]
    }).compile();

    controller = module.get<BookController>(BookController);
    service = module.get<BookService>(BookService);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  //
  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  //1.
  // it ('calling read method', async (req) => {
  //
  //   //const book = await service.getBookURL();
  //   const ifPurchase = true;
  //   const ifEmail = true;
  //   jest.spyOn(recordService, 'checkIfUserPurchaseItem').mockImplementation(async () => true);
  //   jest.spyOn(emailSubscriptionService, 'checkIfUserEmailSubItem').mockImplementation(async () => true);
  //   expect(await service.getBookURL(1,"hi", "hi@hi")).toStrictEqual({bookURL: process.env.BOOK_ROOT_PATH,
  //     ifPurchase:ifPurchase,
  //     ifEmailSub:ifEmail});
  // });


  // it('calling read method', (req) => {
  //   console.log(req.user)
  //   const userId = req.user.user_id
  //   const userEmail = req.user.email
  //   const itemName = 'Calculus1, 2&3'
  //   const readValidation = await this.bookService.getBookURL(userId,itemName,userEmail)
  //   //controller.create(dto);
  //   expect(service.create).toHaveBeenCalledWith(dto);
  // });

  //async read(@Request() req) {
  //         console.log(req.user)
  //         const userId = req.user.user_id
  //         const userEmail = req.user.email
  //         const itemName = 'Calculus1, 2&3'
  //         const readValidation = await this.bookService.getBookURL(userId,itemName,userEmail)
  //         return {readValidation}
  //     }
  it('calling read method', () => {
    const userId = 1;
    const userEmail = 'test@test.com';
    const req = createRequest({
      user: {
        user_id: userId,
        email: userEmail
      }
    });

    const itemName = 'Calculus1, 2&3';
    controller.read(req);
    expect(service.getBookURL).toHaveBeenCalledWith(userId, itemName, userEmail);

  });

});
