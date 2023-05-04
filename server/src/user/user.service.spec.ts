import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import {User} from "../user/entities/user.entity";
import {Repository} from "typeorm";
import {MockType} from "../transaction/transaction.service.spec";
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { createMock } from '@golevelup/ts-jest';
import {EmailService} from "../email/email.service";

describe('UserService', () => {
  let service: UserService;
  let repositoryMock: MockType<Repository<User>>;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
          UserService,
          {
            provide: getRepositoryToken(User),
            useValue: createMock<User>(),
          }
    ],
    }).compile();

    service = module.get<UserService>(UserService);
    repositoryMock = module.get(getRepositoryToken(User));
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should find one user', async () => {
    const result = new User();
    result.email = "ncc@me.com";
    jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => result);
    expect(await service.findOne("ncc@me.com")).toBe(result);
  });

  it('should find all user', async () => {
    jest.spyOn(repositoryMock, 'find').mockImplementation(() => true);
    expect(await service.findAll()).toBe(true);
  });


});

