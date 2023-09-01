import { ItemService } from './item.service';
import { ItemEntity } from "./item.entity";
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ItemDto } from './item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { createMock } from '@golevelup/ts-jest';
import {MockType} from "../transaction/transaction.service.spec";

describe('ItemService', () => {
  let service: ItemService;
  let repositoryMock: MockType<Repository<ItemEntity>>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        {
          provide: getRepositoryToken(ItemEntity),
          useValue: createMock<ItemEntity>(),
        }
      ],
    }).compile();

    service = module.get<ItemService>(ItemService);
    repositoryMock = module.get(getRepositoryToken(ItemEntity));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create an item', async () => {
    const item = new ItemDto();
    const msg = `This action adds a new item`;
    expect(await service.create(item)).toBe(msg);
  });

  it('should find all items', async () => {
    jest.spyOn(repositoryMock, 'find').mockImplementation(() => true);
    expect(await service.findAll()).toBe(true);
  });

  it('should fine one item', async () => {
    const result = new ItemEntity();
    result.itemId = 123;
    jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => result);
    expect(await service.findOne(123)).toBe(result);
  });

  it('should update a item', async () => {
    const id = 123;
    const updatedto = new UpdateItemDto();
    const msg = `This action updates a #${id} item`;
    jest.spyOn(repositoryMock, 'update').mockImplementation(() => true);
    expect(await service.update(id, updatedto)).toBe(msg);
  });

  it('should remove a item', async () => {
    const id = 123;
    const msg = `This action removes a #${id} item`;
    jest.spyOn(repositoryMock, 'remove').mockImplementation(() => true);
    expect(await service.remove(id)).toBe(msg);
  });
});
