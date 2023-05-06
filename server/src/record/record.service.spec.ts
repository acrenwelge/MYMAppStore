import { Test, TestingModule } from '@nestjs/testing';
import { RecordService } from './record.service';
import { Record } from "./entities/record.entity";
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateRecordDto } from './dto/create-record.dto';
import { createMock } from '@golevelup/ts-jest';
import {Item} from "../item/entities/item.entity";
import {Transaction} from "../transaction/entities/transaction.entity";

describe('RecordService', () => {
  let service: RecordService;
  let itemMock: MockType<Repository<Item>>;
  let repositoryMock: MockType<Repository<Record>>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecordService,
        {
          provide: getRepositoryToken(Item),
          useValue: createMock<Item>(),
        },
        {
          provide: getRepositoryToken(Record),
          useValue: createMock<Record>(),
        }
      ],
    }).compile();

    service = module.get<RecordService>(RecordService);
    itemMock = module.get(getRepositoryToken(Item));
    repositoryMock = module.get(getRepositoryToken(Record));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a record', async () => {
    const rec = new CreateRecordDto();
    const msg = `This action adds a new record`;
    jest.spyOn(repositoryMock, 'create').mockImplementation(() => true);
    expect(await service.create(rec)).toBe(msg);
  });

  it('should find all record', async () => {
    const testid = 1;
    jest.spyOn(repositoryMock, 'find').mockImplementation(() => true);
    expect(await service.findAll(testid)).toBe(true);
  });

  it('should fine one record', async () => {
    const id = 1;
    const msg = `This action returns a #${id} record`;
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


  it('should update a record', async () => {
    const updateitem = new Item();
    const updateRec = new Record();
    updateRec.expirationDate = new Date("2024-01-01");

    jest.spyOn(itemMock, 'findOne').mockImplementation(() => updateitem);
    jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => updateRec);
    jest.spyOn(itemMock, 'findOne').mockImplementation(() => updateitem);
    jest.spyOn(repositoryMock, 'save').mockImplementation(() => true);
    expect(await service.update(updateRec.user_id, updateitem.id)).toBe(updateRec);
  });

  it('should check if user purchased item', async () => {
    const checkuserid = 1;
    const checkitemname = "calc";
    const checkRec = new Record();
    checkRec.expirationDate = new Date("2024-01-01");
    jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => checkRec);
    expect(await service.checkIfUserPurchaseItem(checkuserid, checkitemname)).toBe(true);
  });


  it('should remove a record', async () => {
    const id = 123;
    const msg = `This action removes a #${id} record`;
    jest.spyOn(repositoryMock, 'remove').mockImplementation(() => true);
    expect(await service.remove(id)).toBe(msg);
  });
});

export type MockType<T> = {
  [P in keyof T]: jest.Mock<{}>;
};
