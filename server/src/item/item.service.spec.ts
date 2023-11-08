import { ItemService } from './item.service';
import { ItemEntity } from './item.entity';
import { NotFoundException } from '@nestjs/common';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { ItemDto } from './item.dto';

describe('ItemService', () => {
  let itemService: ItemService;
  let itemRepository;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ItemService,
        {
          provide: getRepositoryToken(ItemEntity),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
          },
        },
      ],
    }).compile();

    itemService = module.get<ItemService>(ItemService);
    itemRepository = module.get(getRepositoryToken(ItemEntity));
  });

  describe('convertToDto', () => {
    it('should convert an ItemEntity to an ItemDto', () => {
      // Create a sample ItemEntity
      const itemEntity = new ItemEntity();
      itemEntity.name = 'Sample Item';
      itemEntity.price = 10.99;
      itemEntity.subscriptionLengthMonths = 12;
  
      // Call the convertToDto function
      const itemDto = itemService.convertToDto(itemEntity);
  
      // Verify that the conversion is correct
      expect(itemDto.itemId).toBe(itemEntity.itemId);
      expect(itemDto.name).toBe(itemEntity.name);
      expect(itemDto.price).toBe(itemEntity.price);
      expect(itemDto.subscriptionLengthMonths).toBe(itemEntity.subscriptionLengthMonths);
    });
  });  

  describe('create', () => {
    it('should create and return an item', async () => {
      const itemDto = new ItemDto();
      const itemEntity = new ItemEntity();
      itemRepository.create.mockReturnValue(itemEntity);
      itemRepository.save.mockResolvedValue(itemEntity);

      const result = await itemService.create(itemDto);

      expect(result).toEqual(itemEntity);
    });
  });

  describe('findAll', () => {
    it('should return an array of items', async () => {
      const items = [new ItemEntity()];
      itemRepository.find.mockResolvedValue(items);

      const result = await itemService.findAll();

      expect(result).toEqual(items.map((item) => itemService.convertToDto(item)));
    });
  });

  describe('findOne', () => {
    it('should return an item by ID', async () => {
      const itemId = 1;
      const itemEntity = new ItemEntity();
      itemRepository.findOne.mockResolvedValue(itemEntity);

      const result = await itemService.findOne(itemId);

      expect(result).toEqual(itemService.convertToDto(itemEntity));
    });

    it('should return undefined if item is not found', async () => {
      const itemId = 1;
      itemRepository.findOne.mockResolvedValue(undefined);

      const result = await itemService.findOne(itemId);

      expect(result).toBeUndefined();
    });
  });

  describe('update', () => {
    it('should update and return an item', async () => {
      const itemId = 1;
      const itemDto = new ItemDto();
      const itemEntity = new ItemEntity();
      itemRepository.findOne.mockResolvedValue(itemEntity);
      itemRepository.save.mockResolvedValue(itemEntity);

      const result = await itemService.update(itemId, itemDto);

      expect(result).toEqual(itemEntity);
    });

    it('should throw NotFoundException if item is not found', async () => {
      const itemId = 1;
      itemRepository.findOne.mockResolvedValue(undefined);

      await expect(itemService.update(itemId, new ItemDto())).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('should remove an item', async () => {
      const itemId = 1;
      const itemEntity = new ItemEntity();
      itemRepository.findOne.mockResolvedValue(itemEntity);

      const result = await itemService.delete(itemId);

      expect(result).toBe(true);
    });

    it('should throw NotFoundException if item is not found', async () => {
      const itemId = 2;
      itemRepository.findOne.mockResolvedValue(undefined);

      await expect(itemService.delete(itemId)).rejects.toThrow(NotFoundException);
      });
  });
});