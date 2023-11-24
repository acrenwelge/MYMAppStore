import { createMock } from '@golevelup/ts-jest';
import {AuthService} from "./auth.service";
import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import {UserService} from "../user/user.service";
import {UserEntity} from "../user/entities/user.entity";
import {createRequest} from "node-mocks-http";
import { UserDto } from 'src/user/user.dto';
import { ClassService}  from "../class/class.service"
import { ClassEntity } from "../class/class.entity"

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
          useValue: createMock<UserEntity>(),
        },
        {
          provide: ClassService,
          useValue: createMock<ClassEntity>(),
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

  it('calling local sign up method', async () => {
    const user = new UserEntity();
    user.email = "ncc@me.com";
    jest.spyOn(userservice, 'localSignUp').mockImplementation(async () => user)
    controller.create(user);
    expect(await userservice.localSignUp).toHaveBeenCalledWith(user)
  });

});
