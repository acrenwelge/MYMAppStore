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
import { UserDto } from './user.dto';

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

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should signup locally', async () => {
      const testUser = new UserEntity();
      testUser.email = "testing@mail.com"
      const userClient = new UserDto();
      userClient.email = "testing@mail.com"
      jest.spyOn(repositoryMock, 'exist').mockImplementation(() => false);
      jest.spyOn(repositoryMock, 'save').mockImplementation(() => testUser);
      jest.spyOn(emailservice, 'sendActivateAccountEmail').mockReturnValue(Promise.resolve());
      expect((await service.localSignUp(userClient)).email).toBe(testUser.email);
  });

  it('should activate an account', async () => {
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

  it('should find all user', async () => {
    const userList = []
    const user = new UserEntity();
    user.email = "banana@gmail.com"
    userList.push(user)
    user.email = "temporary@mail.com"
    userList.push(user)
    jest.spyOn(repositoryMock, 'find').mockImplementation(() => userList);
    expect((await service.findAll()).pop().email).toBe(userList[1].email);
  });

  it('should find one user', async () => {
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

  // TODO: Does not work
  it('should authenticate a user', async () => {
    const result = new UserEntity();
    result.email = "test@mail.com";
    result.passwordHash = "abcdefg";
    jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => result);
    expect(await service.authenticate(result)).toBe(result);
  });

  // TODO: Does not work
  it('should NOT authenticate a user', async () => {
    const result = new UserEntity();
    result.email = "test@mail.com";
    result.passwordHash = "abcdefg";
    jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => null);
    expect(await service.authenticate(result)).toBeNull();
  });

  it('should delete a user', async () => {
    jest.spyOn(repositoryMock, 'delete').mockImplementation(() => null);
    await service.deleteOne(1);
    expect(repositoryMock.delete).toBeCalledWith(1);
  });

  it('should change first and last name', async () => {
    const oldUser = new UserEntity()
    oldUser.email = "test@mail.com"
    oldUser.firstName = "Testing"
    oldUser.lastName = "Bad name"
    const user = new UserDto()
    user.email = "test@mail.com"
    user.firstName = "John"
    user.lastName = "Doe"
    jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => oldUser);
    expect((await service.updateOne(user)).firstName).toBe(user.firstName)
  });

  it('should change password', async () => {
    const user = new UserEntity()
    user.email = "test@mail.com"
    const update = new UserDto()
    update.email = "test@mail.com"
    update.password = "applesButter32Game"
    jest.spyOn(repositoryMock, 'update').mockImplementation(() => user)
    // We have the same expectation that the password hash test does
    expect((await service.updateOne(update)).passwordHash).toHaveLength(60)
  });

});

