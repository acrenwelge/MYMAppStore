import { createMock } from '@golevelup/ts-jest';
import { ItemService } from './item.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ItemController } from './item.controller';
import { CreateItemDto } from './dto/create-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';
import { Item } from './entities/item.entity';
import {CreateTransactionDto} from "../transaction/dto/create-transaction.dto";
import {Transaction} from "../transaction/entities/transaction.entity";

describe('ItemController', () => {
  let controller: ItemController;
  let service: ItemService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ItemController],
      providers: [
        ItemService,
        {
          provide: ItemService,
          useValue: createMock<ItemService>(),
        }
      ],
    }).compile();

    controller = module.get<ItemController>(ItemController);
    service = module.get<ItemService>(ItemService);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calling create method', () => {
    const dto: CreateTransactionDto = new CreateItemDto();
    controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });

  it('calling findAll method', () => {
    controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('calling findOne method', () => {
    const id = 123;
    controller.findOne(id);
    expect(service.findOne).toHaveBeenCalledWith(+id);
  });


  it('calling update method', () => {
    const id = "123";
    const item = new Item();
    controller.update(id, item);
    expect(service.update).toBeCalledWith(+id, item);
  });

  it('calling remove method', () => {
    const id = '123';
    controller.remove(id);
    expect(service.remove).toHaveBeenCalledWith(+id);
  });

});
