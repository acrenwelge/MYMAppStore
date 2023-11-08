import { createMock } from '@golevelup/ts-jest';
import { ItemService } from './item.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ItemController } from './item.controller';
import { ItemDto } from './item.dto';


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
      ]
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
    const testItem = new ItemDto();
    controller.create(testItem);
    expect(service.create).toHaveBeenCalled();
  });

  it('calling findOne method', () => {
    const id = 1;
    controller.findOne(id);
    expect(service.findOne).toHaveBeenCalledWith(+id);
  });

  it('calling findAll method', () => {
    controller.findAll();
    expect(service.findAll).toHaveBeenCalled();
  });

  it('calling update method', () => {
    const id = 1;
    const testItem = new ItemDto();
    controller.update(id, testItem);
    expect(service.update).toHaveBeenCalled();
  });

  it('calling remove method', () => {
    const id = 1;
    controller.delete(id);
    expect(service.update).toHaveBeenCalled();
  });

});
