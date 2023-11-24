import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService} from "@nestjs/jwt";
import { UserService } from './../user/user.service';
import {MockType} from "../transaction/transaction.service.spec";
import {Repository} from "typeorm";
import {UserEntity} from "../user/entities/user.entity";
import {createMock} from "@golevelup/ts-jest";
//import {Transaction} from "../transaction/entities/transaction.entity";

describe('AuthService', () => {
  let service: AuthService;
  let jwtservice: JwtService;
  let userservice: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AuthService,
        {
          provide: JwtService,
          useValue: createMock<JwtService>(),
        },
        {
          provide: UserService,
          useValue: createMock<UserService>(),
        }
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtservice = module.get<JwtService>(JwtService);
    userservice = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should validate a user by email', async () => {
    const user = new UserEntity()
    user.email = "test@test.com"
    user.passwordHash = "1235a16"
    jest.spyOn(userservice, 'findOneByEmail').mockImplementation(async () => user)
    expect(await service.validateUserByEmail(user.email,user.passwordHash)).toBe(user);
  });

  it('should not validate an invalid user', async () => {
    const user = new UserEntity()
    user.email = "test@test.com"
    user.passwordHash = "1235a16"
    jest.spyOn(userservice, 'findOneByEmail').mockImplementation(async () => user)
    expect(await service.validateUserByEmail(user.email,"a,dldlfgh")).toBe(null);
  });

  // TODO: find out how to get this to work. I need the userID, I think, but I'm not sure
  xit('should login', async () => {
    const user = new UserEntity()
    user.email = "test@test.com"
    jest.spyOn(userservice, 'findOneByEmail').mockImplementation(async () => user)
    const payload = {email: user.email, sub: user.userId, role:user.role}
    const result = {user: user, access_token: jwtservice.sign(payload)}
    expect(await service.login(user)).toStrictEqual(result)
  });

});
