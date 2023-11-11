import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import Mail from "nodemailer/lib/mailer";
import {Repository} from "typeorm";
import {MockType} from "../transaction/transaction.service.spec";
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMock } from '@golevelup/ts-jest';
import {UserService} from "../user/user.service";
import { UserEntity } from "../user/entities/user.entity";
import * as path from "path";
import { async } from 'rxjs';


describe('EmailService', () => {
  let service: EmailService;
  let usrservice: UserService;
  //let repositoryMock: MockType<Repository<Mail>>;
  const env = process.env;

  beforeAll(async () => {
    
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EmailService,  
        UserService,
        {
          provide: UserService,
          useValue: createMock<UserService>(),
        },
        // {
        //   provide: getRepositoryToken(User),
        //   useValue: createMock<User>(),
        // }
      ],
    }).compile();

    service = module.get<EmailService>(EmailService);
    //repositoryMock = module.get(getRepositoryToken(Mail));
    usrservice = module.get<UserService>(UserService);

    process.env = { ...env };
  });

  afterAll(() => {
    jest.clearAllMocks();
    process.env = env;
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it ('should return when email is false', async () => {
    const testuser = new UserEntity();
    process.env.EMAIL_ENABLE = 'false';
    jest.spyOn(usrservice, 'activateAccount').mockImplementation(async() => testuser);
    await expect(service.sendActivateAccountEmail(testuser)).resolves.not.toThrow();
  });

  it ('should return when email is test', async () => {
    const testuser = new UserEntity();
    testuser.firstName = "James"
    testuser.lastName = "Draugen"
    testuser.email = "james@james.com"
    process.env.EMAIL_ENABLE = 'test';
    jest.spyOn(usrservice, 'findOneByEmail').mockImplementation(async() => testuser);
    jest.spyOn(service, 'sendEmail').mockImplementation(async() => Promise.resolve()); 
    await expect(service.sendActivateAccountEmail(testuser)).resolves.not.toThrow();
  });

  it('should send activate account email', async () => {
    process.env.EMAIL_ENABLE = 'none';
    const testuser = new UserEntity();
    testuser.activationCode='a'
    testuser.firstName = 'a'
    testuser.lastName = 'a'
    testuser.email = 'abcd'
    testuser.activatedAccount = false
    const result = "A";
    // console.log(process.env);
    //expect.assertions(1);
    jest.spyOn(usrservice, 'activateAccount').mockImplementation(async() => testuser);
    jest.spyOn(service,'sendActivateAccountEmail').mockReturnValue(Promise.resolve());
    await expect(service.sendActivateAccountEmail(testuser)).resolves.not.toThrow();
  });

  xit('should handle active account emails when mail is false', async () => {
    // Check log for mail disabled
  })

  xit('should send a reminder email', async () => {
    // Ensure reminder email code runs
  })

  xit('should not send an email if feature is disabled', async () => { 
    // Check for console log output
  })

  xit('should send a url when env email_enable is test', async () => {
    // Check to make sure email is being logged to console 
  })

  xit('should send an email with transporter', async () => {
    // Ensure that transporter.sendMail works
  })

  xit('should handle an error if transporter mail fails', async () => {
    // Make sure error runs
  })

  xit('should close transporter on destroy', async () => {
    // See if our transporter is being closed when onModuleDestroy is called
    // Might be a good idea to look into the close function rather
  })

  it('should check healthy', async () => {
    const result = true;
    //jest.spyOn(Mail, 'verify').mockImplementation(async() => result);
    expect(await service.healthy()).not.toBe(result);
  });

  xit('should check if not healthy', async () => {
    // have the transporter verify fail,
    // see if we return false
  })



});
