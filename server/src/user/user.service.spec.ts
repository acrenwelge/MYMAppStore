import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import {User} from "../user/entities/user.entity";
import {Repository} from "typeorm";
import {MockType} from "../transaction/transaction.service.spec";
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMock } from '@golevelup/ts-jest';
import {EmailService} from "../email/email.service";


describe('UserService', () => {
  let service: UserService;
  let emailservice: EmailService;
  let repositoryMock: MockType<Repository<User>>;

  // const UserServiceMock =
  //     { localSignUp: jest.fn(),
  //       generateActivationCode: jest.fn(),
  //       authenticate: jest.fn(),
  //       activateAccount: jest.fn(),
  //       findOne: jest.fn(),
  //       findAll: jest.fn(),
  //         find: jest.fn(),
  //         save: jest.fn()
  //     };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          UserService,
          {
            provide: EmailService,
            useValue: createMock<EmailService>(),
          },
          {
            provide: getRepositoryToken(User),
            useValue: createMock<User>(),
          }
    ],
    }).compile();

    service = module.get<UserService>(UserService);
    emailservice = module.get<EmailService>(EmailService);
    repositoryMock = module.get(getRepositoryToken(User));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should signup locally', async () => {
      const olduser = null;
      const testuser = new User();
      jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => olduser);
      jest.spyOn(repositoryMock, 'save').mockImplementation(() => testuser);
      jest.spyOn(emailservice, 'sendActivateAccountEmail').mockReturnValue(Promise.resolve());
      expect(await service.localSignUp(testuser)).toBe(undefined);
  });

  /*
  it('should generate a new activation code', () => {
      //const oldstr = "abc";
      //const newstr = 'Naomi2049'+ Date.now().toString()+'ncclovekk';
      // jest.spyOn(repositoryMock, 'generateActivationCode').mockImplementation(() => newstr);
      expect(service.generateActivationCode("abc")).toStrictEqual('Naomi2049'+ Date.now().toString()+'ncclovekk');
  });
  //if too slow it won't work
*/


  it('should activate an account', async () => {
    const activcode = "a";
    const olduser = new User();
    olduser.activationCode = activcode;
    olduser.activatedAccount = false;
    const newuser = new User();
    newuser.activationCode = activcode;
    newuser.activatedAccount = true;
    jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => olduser);
    jest.spyOn(repositoryMock, 'save').mockImplementation(() => newuser);
    expect(await service.activateAccount(newuser.activationCode)).toStrictEqual(newuser);
  });

  it('should find all user', async () => {

    jest.spyOn(repositoryMock, 'find').mockImplementation(() => true);
    expect(await service.findAll()).toBe(true);
  });

  it('should find one user', async () => {
    const result = new User();
    result.email = "ncc@me.com";
    jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => result);
    expect(await service.findOne("ncc@me.com")).toBe(result);
  });

});

