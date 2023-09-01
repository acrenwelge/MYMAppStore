import { FreeSubscriptionService } from './free-subscription.service';
import {FreeSubscriptionEntity} from "./free-subscription.entity";
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMock } from '@golevelup/ts-jest';
import {TransactionEntity} from "../transaction/entities/transaction.entity";
import {MockType} from "../transaction/transaction.service.spec";
import {CreateTransactionDto} from "../transaction/transaction.dto";
import {PurchaseCodeEntity} from "../purchaseCode/purchaseCode.entity";


describe('FreeSubscriptionService', () => {
  let service: FreeSubscriptionService;
  let repositoryMock: MockType<Repository<FreeSubscriptionEntity>>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FreeSubscriptionService,
        {
          provide: getRepositoryToken(FreeSubscriptionEntity),
          useValue: createMock<FreeSubscriptionEntity>(),
        }
      ],
    }).compile();

    service = module.get<FreeSubscriptionService>(FreeSubscriptionService);
    repositoryMock = module.get(getRepositoryToken(FreeSubscriptionEntity));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a EmailSubscription', async () => {
    const emailsub = new FreeSubscriptionEntity();
    jest.spyOn(repositoryMock, 'save').mockImplementation(() => true);
    expect(await service.create(emailsub)).toBe(true);
  });

  it('should find all EmailSubscription', async () => {
    jest.spyOn(repositoryMock, 'find').mockImplementation(() => true);
    expect(await service.findAll()).toBe(true);
  });

  it('should find one EmailSubscription', async () => {
    const result = new FreeSubscriptionEntity();
    result.suffix = '123';
    jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => result);
    expect(await service.findOne('123')).toBe(result);
  });

  it('should add a email subscription if it does not exist', async () => {
    const oldSub = null;
    const newSub = new FreeSubscriptionEntity();
    const suffix = '456';
    jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => oldSub);
    jest.spyOn(repositoryMock, 'save').mockImplementation(() => newSub);
    expect(await service.addOne(suffix)).toBe(newSub);
  });

  it('should remove a email sub', async () => {
    const id= 1;
    const tmpCode = new FreeSubscriptionEntity();
    tmpCode.email_sub_id = id;
    jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => tmpCode);
    jest.spyOn(repositoryMock, 'remove').mockImplementation(() => true);
    expect(await service.deleteEmailSub(id)).toBe(tmpCode);
  });


  it('should update a email sub', async () => {
    const updateid = 1;
    const updatesuffix = "AAA";
    const update = new FreeSubscriptionEntity();
    update.email_sub_id = updateid;
    update.suffix = updatesuffix;

    jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => update);
    jest.spyOn(repositoryMock, 'save').mockImplementation(() => true);
    expect(await service.updateEmailSub(update.email_sub_id, update.suffix)).toStrictEqual(update);
  });

  it('should validate a email sub', async () => {
    const findemailsub = new FreeSubscriptionEntity();
    findemailsub.suffix = "VALIDATE";
    jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => findemailsub);
    expect(await service.userEmailHasFreeSubscription(findemailsub.suffix)).toBe(true);
  });

});
