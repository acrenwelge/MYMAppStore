import { Test, TestingModule } from '@nestjs/testing';
import { BookService } from "../book.service"
import {createMock} from "@golevelup/ts-jest";
import { BookController } from '../book.controller';
import { createRequest } from 'node-mocks-http';

describe('BookService', () => {
    let controller: BookController;
    let service: BookService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [
              BookController,
            {
              provide: BookService,
              useValue: createMock<BookService>(),
            },
          ],
        }).compile();
    
        controller = module.get<BookController>(BookController);
        service = module.get<BookService>(BookService);
      });
    
    afterAll(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should fetch the book url', async () => {
        const userId = 1;
        const req = createRequest({user: { user_id: userId}});
        const itemName = "Calculus";
        controller.read(req, itemName);
        expect(service.getBookURL).toHaveBeenCalledWith(userId, 1, itemName);
    });
})