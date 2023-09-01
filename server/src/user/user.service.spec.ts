import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import {UserEntity} from "../user/entities/user.entity";
import {Repository} from "typeorm";
import {MockType} from "../transaction/transaction.service.spec";
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMock } from '@golevelup/ts-jest';
import {EmailService} from "../email/email.service";
import { hash } from 'bcrypt';
import { SubscriptionService } from 'src/subscription/subscription.service';

describe('UserService', () => {
  let service: UserService;
  let emailservice: EmailService;
  let repositoryMock: MockType<Repository<UserEntity>>;

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
            provide: SubscriptionService,
            useValue: createMock<SubscriptionService>(),
          },
          {
            provide: EmailService,
            useValue: createMock<EmailService>(),
          },
          {
            provide: getRepositoryToken(UserEntity),
            useValue: createMock<UserEntity>(),
          }
    ],
    }).compile();
    service = module.get<UserService>(UserService);
    emailservice = module.get<EmailService>(EmailService);
    repositoryMock = module.get(getRepositoryToken(UserEntity));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  xit('should be defined', () => {
    expect(service).toBeDefined();
  });

  xit('should signup locally', async () => {
      const olduser = null;
      const testuser = new UserEntity();
      jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => olduser);
      jest.spyOn(repositoryMock, 'save').mockImplementation(() => testuser);
      jest.spyOn(emailservice, 'sendActivateAccountEmail').mockReturnValue(Promise.resolve());
      expect(await service.localSignUp(testuser)).toBe(undefined);
  });

  /*
  xit('should generate a new activation code', () => {
      //const oldstr = "abc";
      //const newstr = 'Naomi2049'+ Date.now().toString()+'ncclovekk';
      // jest.spyOn(repositoryMock, 'generateActivationCode').mockImplementation(() => newstr);
      expect(service.generateActivationCode("abc")).toStrictEqual('Naomi2049'+ Date.now().toString()+'ncclovekk');
  });
  //if too slow it won't work
*/

  xit('should activate an account', async () => {
    const activcode = "a";
    const olduser = new UserEntity();
    olduser.activationCode = activcode;
    olduser.activatedAccount = false;
    const newuser = new UserEntity();
    newuser.activationCode = activcode;
    newuser.activatedAccount = true;
    jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => olduser);
    jest.spyOn(repositoryMock, 'save').mockImplementation(() => newuser);
    expect(await service.activateAccount(newuser.activationCode)).toStrictEqual(newuser);
  });

  xit('should find all user', async () => {
    jest.spyOn(repositoryMock, 'find').mockImplementation(() => true);
    expect(await service.findAll()).toBe(true);
  });

  xit('should find one user', async () => {
    const result = new UserEntity();
    result.email = "ncc@me.com";
    jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => result);
    expect(await service.findOneByEmail("ncc@me.com")).toBe(result);
  });

  it('should hash a password', async () => {
    const plaintext = "123";
    const res = await hash(plaintext, 10)
    console.log(res)
    expect(res).toHaveLength(60);
  })

  xit('should authenticate a user', async () => {
    const result = new UserEntity();
    result.email = "test@mail.com";
    result.passwordHash = "abcdefg";
    jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => result);
    expect(await service.authenticate(result)).toBe(result);
  });

  xit('should NOT authenticate a user', async () => {
    const result = new UserEntity();
    result.email = "test@mail.com";
    result.passwordHash = "abcdefg";
    jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => null);
    expect(await service.authenticate(result)).toBeNull();
  });

  xit('should delete a user', async () => {
    jest.spyOn(repositoryMock, 'delete').mockImplementation(() => null);
    await service.deleteOne(1);
    expect(repositoryMock.delete).toBeCalledWith(1);
  });
});

