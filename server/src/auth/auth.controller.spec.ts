import { createMock } from '@golevelup/ts-jest';
import {AuthService} from "./auth.service";
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';

import {UserService} from "../user/user.service";
import {User} from "../user/entities/user.entity";
import {RecordService} from "../record/record.service";
import {getRepositoryToken} from "@nestjs/typeorm";
import {CreateTransactionDto} from "../transaction/dto/create-transaction.dto";
import {createRequest} from "node-mocks-http";

describe('AuthController', () => {
  let controller: AuthController;
  let service: AuthService;
  let userservice: UserService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        AuthService,
        {
          provide: AuthService,
          useValue: createMock<AuthService>(),
        },
        {
          provide: UserService,
          useValue: createMock<User>(),
        }
      ]
    }).compile();
    service = module.get<AuthService>(AuthService);
    userservice = module.get<UserService>(UserService);
    controller = module.get<AuthController>(AuthController);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });


  it('calling local sign up method', () => {
    const user = new User();
    user.email = "ncc@me.com";
    controller.create(user);
    expect(userservice.localSignUp).toHaveBeenCalledWith(user);
  });

  /*local-login : Request*/
  it('calling local login method', () => {
    const req = createRequest({
      user: {user_id: 1,}
    });
    controller.localLogin(req.user);
    expect(service.login).toHaveBeenCalledWith(undefined);
  });

  /*get profile : Request*/
  it('calling get profile method', () => {
    const req = createRequest({
      user: {user_id: 1,}
    });
    //controller.getProfile(req.user);
    const result = req.user;
    expect(controller.getProfile(req.user)).toBe(undefined);
  });
  /*
  it('calling activate method', () => {
    const actcode = {activationCode: "aaaaaa"};
    controller.activateAccount(actcode);
    expect(userservice.activateAccount).toHaveBeenCalledWith(actcode.activationCode);
  });
*/


});
