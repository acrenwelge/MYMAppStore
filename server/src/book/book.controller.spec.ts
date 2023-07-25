import { Test, TestingModule } from '@nestjs/testing';
import { BookController } from './book.controller';
import { BookService } from "./book.service";
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

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

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
    expect(service.getBookURL).toHaveBeenCalledWith(userId, itemName);
  });

});
