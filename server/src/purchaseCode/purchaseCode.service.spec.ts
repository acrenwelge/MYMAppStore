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


  it('should add a code', async () => {
    //const name = "NEWCODE";
    //const priceOff = 12;
    const newcode = new PurchaseCode();
    // @ts-ignore
    jest.spyOn(repositoryMock, 'addOne').mockImplementation(() => true);
    expect(await service.addOne(newcode.name, newcode.priceOff)).toBe(true);
  });


  it('should remove a code', async () => {
    const id= 1;
    const remove = new PurchaseCode();
    remove.code_id = 1;
    //const msg = `This action removes a #${id} transaction`;
    // @ts-ignore
    jest.spyOn(repositoryMock, 'deleteCode').mockImplementation(() => true);
    expect(await service.deleteCode(id)).toStrictEqual(remove);
  });

  it('should validate a code', async () => {
    const validate = new PurchaseCode();
    //validate.name = "VALIDATE";
    validate.code_id = 1;
    // @ts-ignore
    jest.spyOn(repositoryMock, 'validateCode').mockImplementation(() => true);
    expect(await service.validateCode("VALIDATE")).toStrictEqual(validate);
  });
  //weird case: give name, return id

  it('should update a transaction', async () => {
    const updateid = 1;
    const updateprice = 50;
    const update = new PurchaseCode();
    update.code_id = updateid;
    update.priceOff = updateprice;
    // @ts-ignore
    jest.spyOn(repositoryMock, 'updateCode').mockImplementation(() => true);
    expect(await service.updateCode(update.code_id, update.priceOff)).toStrictEqual(update);
  });



});

/*
export const repositoryMockFactory: () => MockType<Repository<any>> = jest.fn(() => {
  findOne: jest.fn(),
  remove:jest.fn(),
  save:jest.fn()
});
*/
export type MockType<T> = {
  [P in keyof T]: jest.Mock<{}>;
};
