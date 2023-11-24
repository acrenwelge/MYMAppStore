import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from "src/subscription/subscription.service";
import {createMock} from "@golevelup/ts-jest";
import { ItemService } from 'src/item/item.service';
import { Repository } from 'typeorm';
import { MockType } from 'src/class/class.service.spec';
import { SubscriptionEntity } from '../subscription.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ItemEntity } from 'src/item/item.entity';
import { UserEntity } from 'src/user/entities/user.entity';
import { Roles } from 'src/roles/role.enum';
import { UserDto } from 'src/user/user.dto';
import { SubscriptionDto } from '../subscription.dto';
import { ItemDto } from 'src/item/item.dto';
import Cart from 'src/payment/payment.entity';

describe('SubscriptionService', () => {
    let service: SubscriptionService;
    let itemService: ItemService;
    let subscriptionRepo: MockType<Repository<SubscriptionEntity>>;
    let mockedSubscriptionEntity: SubscriptionEntity;
    let mockedItemEntity: ItemEntity;
    let mockedUserEntity: UserEntity;
    let subscriptionDto: SubscriptionDto;
    let itemDto: ItemDto;
    let userDto: UserDto;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
          providers: [
              SubscriptionService,
            {
              provide: ItemService,
              useValue: createMock<ItemService>(),
            },
            {
                provide: getRepositoryToken(SubscriptionEntity),
                useValue: createMock<SubscriptionEntity>(),
            },
          ],
        }).compile();
    
        service = module.get<SubscriptionService>(SubscriptionService);
        itemService = module.get<ItemService>(ItemService);
        subscriptionRepo = module.get(getRepositoryToken(SubscriptionEntity));

        mockedItemEntity = new ItemEntity(1);
        mockedItemEntity.name = "item";
        mockedItemEntity.price = 100;
        mockedItemEntity.subscriptionLengthMonths = 12;

        mockedUserEntity = new UserEntity(1);
        mockedUserEntity.firstName = "test";
        mockedUserEntity.lastName = "user1";
        mockedUserEntity.email = "user1@tester.com";
        mockedUserEntity.passwordHash = "blank";
        mockedUserEntity.activatedAccount = true;
        mockedUserEntity.role = Roles.User;
        mockedUserEntity.transactions = [];
        mockedUserEntity.usingSubscriptions = [];
        mockedUserEntity.ownedSubscriptions = [];

        mockedSubscriptionEntity = new SubscriptionEntity(1);
        mockedSubscriptionEntity.item = mockedItemEntity;
        mockedSubscriptionEntity.user = mockedUserEntity;
        mockedSubscriptionEntity.expirationDate = new Date(Date.now()*1000);
        mockedSubscriptionEntity.owner = mockedUserEntity;

        itemDto = new ItemDto();
        itemDto.itemId = 1;
        itemDto.name = "item";
        itemDto.price = 100;
        itemDto.subscriptionLengthMonths = 12;

        userDto = new UserDto();
        userDto.email = "test@email.com";
        userDto.firstName = "Test";
        userDto.lastName = "User";
        userDto.password = "password";
        userDto.role = Roles.User;
        userDto.createdAt = new Date(Date.now());
        userDto.updatedAt = new Date(Date.now());
        userDto.userId = 1;
        userDto.activatedAccount = true;

        subscriptionDto = new SubscriptionDto();
        subscriptionDto.id = 1;
        subscriptionDto.expirationDate = new Date(Date.now());
        subscriptionDto.item = itemDto;
        subscriptionDto.user = userDto;
      });
    
    afterAll(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('create a subscription', async () => {
        jest.spyOn(subscriptionRepo, 'create').mockImplementation(() => mockedSubscriptionEntity);
        jest.spyOn(subscriptionRepo, 'save').mockImplementation(() => mockedSubscriptionEntity);
        expect(await service.create(subscriptionDto)).toStrictEqual(mockedSubscriptionEntity);
    });

    it('find all subscriptions', async () => {
        jest.spyOn(subscriptionRepo, 'find').mockImplementation(() => [mockedSubscriptionEntity]);
        expect(await service.findAll()).toStrictEqual([mockedSubscriptionEntity]);
    });

    it('find one subscription', async () => {
        jest.spyOn(subscriptionRepo, 'findOne').mockImplementation(() => mockedSubscriptionEntity);
        expect(await service.findOne(1)).toStrictEqual(mockedSubscriptionEntity);
    });

    it('find subscriptions for owner', async () => {
        jest.spyOn(subscriptionRepo, 'find').mockImplementation(() => [mockedSubscriptionEntity]);
        expect(await service.findAllForOwner(1)).toStrictEqual([mockedSubscriptionEntity]);
    });

    it('add or extend subscription for themseleves', async () => {
        const cartData:Cart = {
            purchaserUserId: 1,
            grandTotal: 500.0,
            hasAccessUserId: 12345,
            items: [
              {
                itemId: 1,
                finalPrice: 100.0,
                quantity: 1,
                purchaseCode: "ABC123",
              }
            ],
          };

          jest.spyOn(subscriptionRepo, 'find').mockImplementation(() => [mockedSubscriptionEntity]);
          jest.spyOn(itemService, 'findOne').mockImplementation(() => Promise.resolve(itemDto));
          jest.spyOn(subscriptionRepo, 'save').mockImplementation(() => mockedSubscriptionEntity);
          await service.addOrExtendSubscriptions(cartData, [1]);
          expect(await service.findOne(1)).toStrictEqual(mockedSubscriptionEntity);
    });

    it('add or extend subscription for someone else', async () => {
        const cartData:Cart = {
            purchaserUserId: 1,
            grandTotal: 500.0,
            hasAccessUserId: 12345,
            items: [
              {
                itemId: 2,
                finalPrice: 200.0,
                quantity: 1,
              },
            ],
          };

          mockedItemEntity = new ItemEntity(2);
          mockedItemEntity.name = "item";
          mockedItemEntity.price = 200;
          mockedItemEntity.subscriptionLengthMonths = 12;
  
          mockedSubscriptionEntity = new SubscriptionEntity(2);
          mockedSubscriptionEntity.item = mockedItemEntity;
          mockedSubscriptionEntity.user = mockedUserEntity;
          mockedSubscriptionEntity.expirationDate = new Date(Date.now()*1000);
          mockedSubscriptionEntity.owner = mockedUserEntity;

          jest.spyOn(subscriptionRepo, 'find').mockImplementation(() => []);
          jest.spyOn(itemService, 'findOne').mockImplementation(() => Promise.resolve(itemDto));
          jest.spyOn(subscriptionRepo, 'save').mockImplementation(() => mockedSubscriptionEntity);
          await service.addOrExtendSubscriptions(cartData, [2]);
          expect(await service.findOne(2)).toStrictEqual(mockedSubscriptionEntity);
    });

    it('check valid subscriptions for user', async () => {
        jest.spyOn(subscriptionRepo, 'find').mockImplementation(() => [mockedSubscriptionEntity]);
        expect(await service.userHasValidSubscription(1, 1)).toBe(true);
    });
})