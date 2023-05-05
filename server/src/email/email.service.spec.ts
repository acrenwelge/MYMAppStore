import { Test, TestingModule } from '@nestjs/testing';
import { EmailService } from './email.service';
import Mail from "nodemailer/lib/mailer";
import {Repository} from "typeorm";
import {MockType} from "../transaction/transaction.service.spec";
import { getRepositoryToken } from '@nestjs/typeorm';
import { createMock } from '@golevelup/ts-jest';
import {UserService} from "../user/user.service";
import { User } from "../user/entities/user.entity";


describe('EmailService', () => {
  let service: EmailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EmailService],
    }).compile();

    service = module.get<EmailService>(EmailService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
