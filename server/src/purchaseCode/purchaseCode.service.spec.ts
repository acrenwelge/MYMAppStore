import { PurchaseCodeService } from './purchaseCode.service';
import { PurchaseCode } from "./purchaseCode.entity";
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMock } from '@golevelup/ts-jest';


describe('PurchaseCodeService', () => {
  let service: PurchaseCodeService;
  let repositoryMock: MockType<Repository<PurchaseCode>>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PurchaseCodeService,
        {
          provide: getRepositoryToken(PurchaseCode),
          useValue: createMock<PurchaseCode>(),
        }
      ],
    }).compile();

    service = module.get<PurchaseCodeService>(PurchaseCodeService);
    repositoryMock = module.get(getRepositoryToken(PurchaseCode));

    // console.log(repositoryMock);

  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a code', async () => {
    const code = new PurchaseCode();
    jest.spyOn(repositoryMock, 'save').mockImplementation(() => true);
    expect(await service.create(code)).toBe(true);
  });

  it('should find all transactions', async () => {
    jest.spyOn(repositoryMock, 'find').mockImplementation(() => true);
    expect(await service.findAll()).toBe(true);
  });

  it('should find one code', async () => {
    const result = new PurchaseCode();
    result.code_id = 1;
    jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => result);
    expect(await service.findOne(1)).toBe(result);
  });


  it('should throw error when add a exists code', async () => {

    const oldCode = new PurchaseCode();
    const newCode = new PurchaseCode();
    
    jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => oldCode);
    jest.spyOn(repositoryMock, 'save').mockImplementation(() => newCode);
    await expect(service.addOne(newCode.name, newCode.priceOff)).rejects.toThrowError();
  });
    
  it('should add a code if it does not exist', async () => {
    
    const oldCode = null;
    const newCode = new PurchaseCode();
    
    jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => oldCode);
    jest.spyOn(repositoryMock, 'save').mockImplementation(() => newCode);
    expect(await service.addOne(newCode.name, newCode.priceOff)).toBe(newCode);
  });


  it('should remove a code', async () => {
    const id= 1;
    const tmpCode = new PurchaseCode();
    tmpCode.code_id = id;
    jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => tmpCode);
    jest.spyOn(repositoryMock, 'remove').mockImplementation(() => true);
    expect(await service.deleteCode(id)).toBe(tmpCode);
  });

  it('should validate a code', async () => {
    const validCode = new PurchaseCode();
    validCode.name = "VALIDATE";
    
    jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => validCode);
    expect(await service.validateCode(validCode.name)).toBe(validCode);
  });
  

  it('should update a transaction', async () => {
    const updateid = 1;
    const updateprice = 50;
    const update = new PurchaseCode();
    update.code_id = updateid;
    update.priceOff = updateprice;

    jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => update);
    jest.spyOn(repositoryMock, 'save').mockImplementation(() => true);
    expect(await service.updateCode(update.code_id, update.priceOff)).toStrictEqual(update);
  });



});


export type MockType<T> = {
  [P in keyof T]: jest.Mock<{}>;
};
