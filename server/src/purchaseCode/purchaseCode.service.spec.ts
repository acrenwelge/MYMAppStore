import { PurchaseCodeService } from './purchaseCode.service';
import { PurchaseCodeEntity } from "./purchaseCode.entity";
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMock } from '@golevelup/ts-jest';
import { PurchaseCodeDto } from './purchaseCode.dto';


describe('PurchaseCodeService', () => {
  let service: PurchaseCodeService;
  let repositoryMock: MockType<Repository<PurchaseCodeEntity>>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseCodeService,
        {
          provide: getRepositoryToken(PurchaseCodeEntity),
          useValue: createMock<PurchaseCodeEntity>(),
        }
      ],
    }).compile();

    service = module.get<PurchaseCodeService>(PurchaseCodeService);
    repositoryMock = module.get(getRepositoryToken(PurchaseCodeEntity));

    // console.log(repositoryMock);

  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a code', async () => {
    const code = new PurchaseCodeEntity();
    jest.spyOn(repositoryMock, 'save').mockImplementation(() => true);
    expect(await service.create(code)).toBe(true);
  });

  it('should find all transactions', async () => {
    jest.spyOn(repositoryMock, 'find').mockImplementation(() => true);
    expect(await service.findAll()).toBe(true);
  });

  it('should find one code', async () => {
    const result = new PurchaseCodeEntity();
    result.code_id = 1;
    jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => result);
    expect(await service.findOne(1)).toBe(result);
  });


  it('should throw error when add a exists code', async () => {

    const oldCode = new PurchaseCodeEntity();
    const newCode = new PurchaseCodeEntity();
    
    jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => oldCode);
    jest.spyOn(repositoryMock, 'save').mockImplementation(() => newCode);
    await expect(service.createOne(newCode.name, newCode.salePrice)).rejects.toThrowError();
  });
    
  it('should add a code if it does not exist', async () => {
    
    const oldCode = null;
    const newCode = new PurchaseCodeEntity();
    
    jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => oldCode);
    jest.spyOn(repositoryMock, 'save').mockImplementation(() => newCode);
    expect(await service.createOne(newCode.name, newCode.salePrice)).toBe(newCode);
  });


  it('should remove a code', async () => {
    const id= 1;
    const tmpCode = new PurchaseCodeEntity();
    tmpCode.code_id = id;
    jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => tmpCode);
    jest.spyOn(repositoryMock, 'remove').mockImplementation(() => true);
    expect(await service.deleteCode(id)).toBe(tmpCode);
  });

  it('should validate a code', async () => {
    const validCode = new PurchaseCodeEntity();
    validCode.name = "VALIDATE";
    
    jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => validCode);
    expect(await service.validateCode(validCode.name)).toBe(validCode);
  });

});


export type MockType<T> = {
  [P in keyof T]: jest.Mock<{}>;
};
