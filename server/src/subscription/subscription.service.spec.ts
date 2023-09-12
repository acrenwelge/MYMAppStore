import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionService } from './subscription.service';
import { SubscriptionEntity } from "./subscription.entity";
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { SubscriptionDto } from './subscription.dto';
import { createMock } from '@golevelup/ts-jest';
import {ItemEntity} from "../item/item.entity";

describe('SubscriptionService', () => {
  let service: SubscriptionService;
  let itemMock: MockType<Repository<ItemEntity>>;
  let repositoryMock: MockType<Repository<SubscriptionEntity>>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        SubscriptionService,
        {
          provide: getRepositoryToken(ItemEntity),
          useValue: createMock<ItemEntity>(),
        },
        {
          provide: getRepositoryToken(SubscriptionEntity),
          useValue: createMock<SubscriptionEntity>(),
        }
      ],
    }).compile();

    service = module.get<SubscriptionService>(SubscriptionService);
    itemMock = module.get(getRepositoryToken(ItemEntity));
    repositoryMock = module.get(getRepositoryToken(SubscriptionEntity));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a subscription', async () => {
    const rec = new SubscriptionDto();
    const msg = `This action adds a new subscription`;
    jest.spyOn(repositoryMock, 'create').mockImplementation(() => true);
    expect(await service.create(rec)).toBe(msg);
  });

  it('should find all subscription', async () => {
    const testid = 1;
    jest.spyOn(repositoryMock, 'find').mockImplementation(() => true);
    expect(await service.findAllForUser(testid)).toBe(true);
  });

  it('should fine one subscription', async () => {
    const id = 1;
    const msg = `This action returns a #${id} subscription`;
    jest.spyOn(repositoryMock, 'remove').mockImplementation(() => true);
    expect(await service.findOne(id)).toBe(msg);
  });

  it('should add months', async () => {
    const months = 2;
    const testdate = new Date();
    const resultdate = testdate;
    resultdate.setMonth(testdate.getMonth() + months);
    expect(service.addMonths(testdate, months)).toBe(resultdate);
  });


  it('should update a subscription', async () => {
    const updateitem = new ItemEntity();
    const updateRec = new SubscriptionEntity();
    updateRec.expirationDate = new Date("2024-01-01");

    jest.spyOn(itemMock, 'findOne').mockImplementation(() => updateitem);
    jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => updateRec);
    jest.spyOn(itemMock, 'findOne').mockImplementation(() => updateitem);
    jest.spyOn(repositoryMock, 'save').mockImplementation(() => true);
    expect(await service.update(updateRec.user.userId, updateitem.itemId)).toBe(updateRec);
  });

  it('should check if user purchased item', async () => {
    const checkuserid = 1;
    const checkitemname = "calc";
    const checkRec = new SubscriptionEntity();
    checkRec.expirationDate = new Date("2024-01-01");
    jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => checkRec);
    expect(await service.userHasValidSubscription(checkuserid, checkitemname)).toBe(true);
  });


  it('should remove a subscription', async () => {
    const id = 123;
    const msg = `This action removes a #${id} subscription`;
    jest.spyOn(repositoryMock, 'remove').mockImplementation(() => true);
    expect(await service.remove(id)).toBe(msg);
  });
});

export type MockType<T> = {
  [P in keyof T]: jest.Mock<{}>;
};
