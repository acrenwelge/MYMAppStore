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

// TODO:  Nest can't resolve dependencies of the AuthController (UserService, AuthService, ?).
// Please make sure that the argument ClassService at index [2] is available in the RootTestModule context.

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

  // TODO: For the next two functions, how do we handle creating a mock user ID?

  // TODO: This doesn't really test anything besides that we call a function.
  // Also, Matcher error: received value must be a mock or spy function
  /*local-login : Request*/
  it('calling local login method', async () => {
    const user = new UserDto()
    user.email = "testing@testing.com"
    user.password = "aaapple"
    const foundUser = new UserEntity()
    foundUser.email = "testing@testing.com"
    jest.spyOn(userservice, 'authenticate').mockImplementation(async () => null)
    jest.spyOn(userservice, 'findOneByEmail').mockImplementation(async () => foundUser)
    expect(await service.login(user)).toHaveBeenCalled()
  });

  // TODO: Request?
  /*get profile : Request*/
  xit('calling get profile method', () => {
    const req = createRequest({
      user: {user_id: 1,}
    });
    //controller.getProfile(req.user);
    const result = req.user;
    expect(controller.getProfile(req.user)).toBe(undefined)
  });
  /*
  it('calling activate method', () => {
    const actcode = {activationCode: "aaaaaa"};
    controller.activateAccount(actcode);
    expect(userservice.activateAccount).toHaveBeenCalledWith(actcode.activationCode);
  });
*/


});
