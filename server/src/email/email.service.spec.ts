import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import Mail from "nodemailer/lib/mailer";
import {Repository} from "typeorm";
import {MockType} from "../transaction/transaction.service.spec";
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMock } from '@golevelup/ts-jest';
import {UserService} from "../user/user.service";
import { User } from "../user/entities/user.entity";
import * as path from "path";


describe('EmailService', () => {
  let service: EmailService;
  let usrservice: UserService;
  //let repositoryMock: MockType<Repository<Mail>>;

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

    service = module.get<EmailService>(EmailService);
    //repositoryMock = module.get(getRepositoryToken(Mail));
    usrservice = module.get<UserService>(UserService);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should send activate account email', async () => {
    const testuser = new User();
    testuser.activationCode='a'
    testuser.name = 'a'
    testuser.email = 'abcd'
    testuser.activatedAccount = false
    const result = "A";
    console.log(process.env);
    //expect.assertions(1);
    jest.spyOn(usrservice, 'activateAccount').mockImplementation(async() => testuser);
    jest.spyOn(service,'sendActivateAccountEmail').mockReturnValue(Promise.resolve());
    expect(await service.sendActivateAccountEmail(testuser)).not.toBe(Promise.resolve());
  });

  it('should check healthy', async () => {
    const result = true;
    //jest.spyOn(Mail, 'verify').mockImplementation(async() => result);
    expect(await service.healthy()).not.toBe(result);
  });



});
