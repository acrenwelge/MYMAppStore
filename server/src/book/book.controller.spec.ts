import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import {TransactionService} from "../transaction/transaction.service";
import {BookService} from "./book.service";

describe('BookController', () => {
  let controller: BookController;
  let service: BookService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [BookController],
      providers: [BookService,
        {
        provide: BookService,
        useClass: BookService,
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




});
