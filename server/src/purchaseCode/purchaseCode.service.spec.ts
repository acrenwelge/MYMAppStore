import { Test, TestingModule } from '@nestjs/testing';
import { PurchaseCodeService } from './purchaseCode.service';
import { PurchaseCodeEntity } from './purchaseCode.entity';
import { ItemEntity } from 'src/item/item.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { NotFoundException, ConflictException } from '@nestjs/common';

// Mock data
const mockPurchaseCodeEntity: PurchaseCodeEntity = {
  name: 'testCode',
  salePrice: 10,
  item: { itemId: 1, name: 'Test Item', price: 20, subscriptionLengthMonths: 12 },
};

const mockPurchaseCodeFormValues = {
  name: 'testCode',
  priceOff: 10,
  itemId: 1,
};

const mockItemEntity: ItemEntity = {
  itemId: 1,
  name: 'Test Item',
  price: 20,
  subscriptionLengthMonths: 12,
};

describe('PurchaseCodeService', () => {
  let service: PurchaseCodeService;
  let purchaseCodeRepo: Repository<PurchaseCodeEntity>;
  let itemRepo: Repository<ItemEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseCodeService,
        {
          provide: getRepositoryToken(PurchaseCodeEntity),
          useClass: Repository,
        },
        {
          provide: getRepositoryToken(ItemEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<PurchaseCodeService>(PurchaseCodeService);
    purchaseCodeRepo = module.get<Repository<PurchaseCodeEntity>>(
      getRepositoryToken(PurchaseCodeEntity),
    );
    itemRepo = module.get<Repository<ItemEntity>>(getRepositoryToken(ItemEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findAll', () => {
    it('should return an array of PurchaseCodeDto', async () => {
      jest
        .spyOn(purchaseCodeRepo, 'find')
        .mockImplementation(async () => [mockPurchaseCodeEntity]);

      const result = await service.findAll();

      expect(result).toEqual([service.convertToDto(mockPurchaseCodeEntity)]);
    });
  });

  describe('findOne', () => {
    it('should return a PurchaseCodeDto if the code exists', async () => {
      jest
        .spyOn(purchaseCodeRepo, 'findOne')
        .mockImplementation(async () => mockPurchaseCodeEntity);

      const result = await service.findOne('testCode');

      expect(result).toEqual(service.convertToDto(mockPurchaseCodeEntity));
    });

    it('should throw NotFoundException if the code does not exist', async () => {
      jest.spyOn(purchaseCodeRepo, 'findOne').mockImplementation(async () => null);

      await expect(service.findOne('nonexistentCode')).rejects.toThrowError(
        NotFoundException,
      );
    });
  });

  describe('createOne', () => {
    it('should create a new PurchaseCodeDto if the code does not exist', async () => {
      jest
        .spyOn(purchaseCodeRepo, 'exist')
        .mockImplementation(async () => false);
      jest
        .spyOn(itemRepo, 'findOne')
        .mockImplementation(async () => mockItemEntity);
      jest
        .spyOn(purchaseCodeRepo, 'save')
        .mockImplementation(async () => mockPurchaseCodeEntity);

      const result = await service.createOne(mockPurchaseCodeFormValues);

      expect(result).toEqual(service.convertToDto(mockPurchaseCodeEntity));
    });

    it('should throw ConflictException if the code already exists', async () => {
      jest.spyOn(purchaseCodeRepo, 'exist').mockImplementation(async () => true);

      await expect(
        service.createOne(mockPurchaseCodeFormValues),
      ).rejects.toThrowError(ConflictException);
    });
  });

  describe('deleteCode', () => {
    it('should delete a PurchaseCodeDto if the code exists', async () => {
      jest
        .spyOn(purchaseCodeRepo, 'findOne')
        .mockImplementation(async () => mockPurchaseCodeEntity);
      jest
        .spyOn(purchaseCodeRepo, 'remove')
        .mockImplementation(async () => Promise.resolve() as any);

      const result = await service.deleteCode('testCode');

      expect(result).toBe(true);
    });

    it('should throw NotFoundException if the code does not exist', async () => {
      jest.spyOn(purchaseCodeRepo, 'findOne').mockImplementation(async () => null);

      await expect(
        service.deleteCode('nonexistentCode'),
      ).rejects.toThrowError(NotFoundException);
    });
  });

  describe('validateCode', () => {
    it('should return a PurchaseCodeDto if the code is valid', async () => {
      jest
        .spyOn(purchaseCodeRepo, 'findOne')
        .mockImplementation(async () => mockPurchaseCodeEntity);

      const result = await service.validateCode('testCode', 1);

      expect(result).toEqual(service.convertToDto(mockPurchaseCodeEntity));
    });

    it('should throw an error message if the code does not exist', async () => {
      jest.spyOn(purchaseCodeRepo, 'findOne').mockImplementation(async () => null);

      await expect(
        service.validateCode('nonexistentCode', 1),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw an error message if the code is not linked to the correct item', async () => {
      const invalidPurchaseCodeEntity = { ...mockPurchaseCodeEntity, item: { itemId: 2, name: 'Invalid Item', price: 20, subscriptionLengthMonths: 6 } };

      jest
        .spyOn(purchaseCodeRepo, 'findOne')
        .mockImplementation(async () => invalidPurchaseCodeEntity);

      await expect(
        service.validateCode('testCode', 1),
      ).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a PurchaseCodeDto if the code exists', async () => {
      jest
        .spyOn(purchaseCodeRepo, 'findOne')
        .mockImplementation(async () => mockPurchaseCodeEntity);
      jest
        .spyOn(itemRepo, 'findOne')
        .mockImplementation(async () => mockItemEntity);
      jest
        .spyOn(purchaseCodeRepo, 'save')
        .mockImplementation(async () => mockPurchaseCodeEntity);
      jest
        .spyOn(service, 'deleteCode')
        .mockImplementation(async () => Promise.resolve(true));

      const result = await service.update('testCode', {
        name: 'updatedCode',
        priceOff: 15,
        item: {
          itemId: 1,
          itemName: 'Updated Item',
          itemSubscriptionLength: 24,
        },
      });

      expect(result).toEqual(service.convertToDto(mockPurchaseCodeEntity));
    });

    it('should throw NotFoundException if the code does not exist', async () => {
      jest.spyOn(purchaseCodeRepo, 'findOne').mockImplementation(async () => null);

      await expect(
        service.update('nonexistentCode', {
          name: 'updatedCode',
          priceOff: 15,
          item: {
            itemId: 1,
            itemName: 'Updated Item',
            itemSubscriptionLength: 24,
          },
        }),
      ).rejects.toThrowError(NotFoundException);
    });

    it('should throw NotFoundException if the item for the purchase code does not exist', async () => {
      jest
        .spyOn(purchaseCodeRepo, 'findOne')
        .mockImplementation(async () => mockPurchaseCodeEntity);
      jest.spyOn(itemRepo, 'findOne').mockImplementation(async () => null);

      await expect(
        service.update('testCode', {
          name: 'updatedCode',
          priceOff: 15,
          item: {
            itemId: 1,
            itemName: 'Updated Item',
            itemSubscriptionLength: 24,
          },
        }),
      ).rejects.toThrowError(NotFoundException);
    });
  });

});