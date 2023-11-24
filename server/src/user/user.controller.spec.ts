import { Test, TestingModule } from "@nestjs/testing";
import { UserController } from "./user.controller";
import { UserService } from "./user.service";
import { createMock } from "@golevelup/ts-jest";
import { createRequest } from "node-mocks-http";
import { UserDto } from "src/user/user.dto";
import { ItemDto } from "src/item/item.dto";
import { Roles } from "src/roles/role.enum";

describe('UserController', () => {

    let controller: UserController;
    let service: UserService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [UserController],
            providers: [
              UserService, 
              { 
                provide: UserService, 
                useValue: createMock<UserService>(),
              }
            ]
          }).compile();
      
          controller = module.get<UserController>(UserController);
          service = module.get<UserService>(UserService);
    });

    afterAll(() => {
        jest.clearAllMocks();
    });
    
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('calling findOne method', () => {
        controller.findOne(1);
        expect(service.findOneById).toHaveBeenCalledWith(1);
    });
})