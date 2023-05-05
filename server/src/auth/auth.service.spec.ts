import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService} from "@nestjs/jwt";
import { UserService } from './../user/user.service';
import {MockType} from "../transaction/transaction.service.spec";
import {Repository} from "typeorm";
import {User} from "../user/entities/user.entity";
import {createMock} from "@golevelup/ts-jest";
import {Transaction} from "../transaction/entities/transaction.entity";

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

  it('should login', async () => {
    const user = new User();
    const payload = {email: user.email, sub: user.id, role:user.role};
    const result = {user: user, access_token: jwtservice.sign(payload)};
    expect(await service.login(user)).toStrictEqual(result);
  });

});
