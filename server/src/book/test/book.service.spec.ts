import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from "src/subscription/subscription.service";
import { BookService } from "../book.service"
import { FreeSubscriptionService } from "src/free-subscription/free-subscription.service";
import { UserService } from "src/user/user.service";
import {createMock} from "@golevelup/ts-jest";
import { UserEntity } from 'src/user/entities/user.entity';
import { ForbiddenException } from '@nestjs/common';

describe('BookService', () => {
    let service: BookService;
    let subscriptionService: SubscriptionService;
    let freeSubscriptionService: FreeSubscriptionService;
    let userService: UserService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [
              BookService,
            {
              provide: SubscriptionService,
              useValue: createMock<SubscriptionService>(),
            },
            {
              provide: FreeSubscriptionService,
              useValue: createMock<FreeSubscriptionService>(),
            },
            {
                provide: UserService,
                useValue: createMock<UserService>(),
              },
          ],
        }).compile();
    
        service = module.get<BookService>(BookService);
        subscriptionService = module.get<SubscriptionService>(SubscriptionService);
        freeSubscriptionService = module.get<FreeSubscriptionService>(FreeSubscriptionService);
        userService = module.get<UserService>(UserService);
      });
    
    afterAll(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should fetch the book url', async () => {
        const userId = 1;
        const email = "test@test.com";
        const itemId = 1;
        const user = new UserEntity();
		    user.email = email;
		    jest.spyOn(userService, 'findOneById').mockImplementation(async(userId) => {return user});
        jest.spyOn(subscriptionService, 'userHasValidSubscription').mockImplementation(async(userId, itemId) => {return true});
        jest.spyOn(freeSubscriptionService, 'userEmailHasFreeSubscription').mockImplementation(async(email) => {return false});

        const res1 = await service.getBookURL(userId, itemId, "Calculus 1");
        expect(res1.bookURL).toBe(process.env.BOOK_ROOT_PATH + "/MYMACalc1/MContents.html");

        const res2 = await service.getBookURL(userId, itemId, "Calculus 2");
        expect(res2.bookURL).toBe(process.env.BOOK_ROOT_PATH + "/MYMACalc2/MContents.html");

        const res3 = await service.getBookURL(userId, itemId, "Calculus 3");
        expect(res3.bookURL).toBe(process.env.BOOK_ROOT_PATH + "/MYMACalc3/MContents.html");

        const res4 = await service.getBookURL(userId, itemId, "Maplets for Calculus");
        expect(res4.bookURL).toBe(process.env.BOOK_ROOT_PATH + "/M4C/MapletsForCalculus.html");
    });

    it('should not fetch the book url', async () => {
        const userId = 1;
        const email = "test@test.com";
        const itemId = 1;
        const itemName = "Calculus 1";
        const user = new UserEntity();
		    user.email = email;
		    jest.spyOn(userService, 'findOneById').mockImplementation(async(userId) => {return user});
        jest.spyOn(subscriptionService, 'userHasValidSubscription').mockImplementation(async(userId, itemId) => {return false});
        jest.spyOn(freeSubscriptionService, 'userEmailHasFreeSubscription').mockImplementation(async(email) => {return false});
        await expect(service.getBookURL(userId, itemId, itemName)).rejects.toThrow(ForbiddenException);
    });
})