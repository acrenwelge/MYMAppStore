import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FreeSubscriptionEntity } from './free-subscription.entity';
import { FreeSubscriptionService } from './free-subscription.service';
import { ConflictException } from '@nestjs/common';

describe('FreeSubscriptionService', () => {
  let service: FreeSubscriptionService;
  let repository: Repository<FreeSubscriptionEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        FreeSubscriptionService,
        {
          provide: getRepositoryToken(FreeSubscriptionEntity),
          useClass: Repository,
        },
      ],
    }).compile();

    service = module.get<FreeSubscriptionService>(FreeSubscriptionService);
    repository = module.get<Repository<FreeSubscriptionEntity>>(
      getRepositoryToken(FreeSubscriptionEntity),
    );
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new subscription', async () => {
      const mockSubscription = new FreeSubscriptionEntity();
      jest.spyOn(repository, 'save').mockResolvedValue(mockSubscription);

      const result = await service.create(mockSubscription);

      expect(result).toBe(mockSubscription);
    });
  });

  describe('findAll', () => {
    it('should return an array of subscriptions', async () => {
      const mockSubscriptions = [
        { email_sub_id: 1, suffix: 'example1' },
        { email_sub_id: 2, suffix: 'example2' },
      ];
      jest.spyOn(repository, 'find').mockResolvedValue(mockSubscriptions);

      const result = await service.findAll();

      expect(result).toBe(mockSubscriptions);
    });
  });

  describe('findOne', () => {
    it('should return a subscription by suffix', async () => {
      const mockSubscription = { email_sub_id: 1, suffix: 'example1' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockSubscription);

      const result = await service.findOne('example1');

      expect(result).toBe(mockSubscription);
    });

    it('should return undefined if subscription does not exist', async () => {
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      const result = await service.findOne('nonexistent');

      expect(result).toBeNull();
    });
  });

  describe('addOne', () => {
    it('should add a new subscription', async () => {
      const mockSubscription = new FreeSubscriptionEntity();
      const suffix = 'newSuffix';

      jest.spyOn(repository, 'findOne').mockResolvedValue(null);
      jest.spyOn(repository, 'save').mockResolvedValue(mockSubscription);

      const result = await service.addOne(suffix);

      expect(result).toBe(mockSubscription);
    });

    it('should throw ConflictException if suffix already exists', async () => {
      const suffix = 'existingSuffix';
      jest.spyOn(repository, 'findOne').mockResolvedValue(new FreeSubscriptionEntity());

      await expect(service.addOne(suffix)).rejects.toThrowError(ConflictException);
    });
  });

  describe('updateEmailSub', () => {
    it('should update an existing subscription', async () => {
      const id = 1;
      const newSuffix = 'updatedSuffix';
      const mockSubscription = { email_sub_id: id, suffix: newSuffix };
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockSubscription);
      jest.spyOn(repository, 'save').mockResolvedValue(mockSubscription);

      const result = await service.updateEmailSub(id, newSuffix);

      expect(result).toBe(mockSubscription);
    });

    it('should throw ConflictException if subscription does not exist', async () => {
      const id = 1;
      const newSuffix = 'updatedSuffix';
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.updateEmailSub(id, newSuffix)).rejects.toThrowError(ConflictException);
    });
  });

  describe('deleteEmailSub', () => {
    it('should delete an existing subscription', async () => {
      const id = 1;
      const mockSubscription = { email_sub_id: id, suffix: 'example1' };
      jest.spyOn(repository, 'findOne').mockResolvedValue(mockSubscription);
      jest.spyOn(repository, 'remove').mockResolvedValue(mockSubscription);

      const result = await service.deleteEmailSub(id);

      expect(result).toBe(mockSubscription);
    });

    it('should throw ConflictException if subscription does not exist', async () => {
      const id = 1;
      jest.spyOn(repository, 'findOne').mockResolvedValue(null);

      await expect(service.deleteEmailSub(id)).rejects.toThrowError(ConflictException);
    });
  });

  describe('userEmailHasFreeSubscription', () => {
    it('should return true for a user with a free subscription', async () => {
      const userEmail = 'user@example1.com';
      const mockEntities = [{email_sub_id: 1, suffix: 'example1.com' }];
      jest.spyOn(repository, 'find').mockResolvedValue(mockEntities);

      const result = await service.userEmailHasFreeSubscription(userEmail);

      expect(result).toBeTruthy();
    });

    it('should return false for a user without a free subscription', async () => {
      const userEmail = 'user@example3.com';
      const mockEntities = [{email_sub_id: 1, suffix: 'example1.com' }, {email_sub_id: 2, suffix: 'example2.com' }];
      jest.spyOn(repository, 'find').mockResolvedValue(mockEntities);

      const result = await service.userEmailHasFreeSubscription(userEmail);

      expect(result).toBeFalsy();
    });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });
});
