import { Test, TestingModule } from "@nestjs/testing";
import { SubscriptionController } from "../subscription.controller"
import { SubscriptionService } from "../subscription.service";
import { createMock } from "@golevelup/ts-jest";
import { createRequest } from "node-mocks-http";
import { SubscriptionDto } from "../subscription.dto";
import { ItemDto } from "src/item/item.dto";
import { UserDto } from "src/user/user.dto";
import { Roles } from "src/roles/role.enum";

describe('SubscriptionConstroller', () => {

    let controller: SubscriptionController;
    let service: SubscriptionService;

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [SubscriptionController],
            providers: [
              SubscriptionService, 
              { 
                provide: SubscriptionService, 
                useValue: createMock<SubscriptionService>(),
              }
            ]
          }).compile();
      
          controller = module.get<SubscriptionController>(SubscriptionController);
          service = module.get<SubscriptionService>(SubscriptionService);
    });

    afterAll(() => {
        jest.clearAllMocks();
    });
    
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('calling create method', () => {
        const itemDto = new ItemDto();
        itemDto.itemId = 1;
        itemDto.name = "item";
        itemDto.price = 100;
        itemDto.subscriptionLengthMonths = 12;

        const userDto = new UserDto();
        userDto.email = "test@email.com";
        userDto.firstName = "Test";
        userDto.lastName = "User";
        userDto.password = "password";
        userDto.role = Roles.User;
        userDto.createdAt = new Date(Date.now());
        userDto.updatedAt = new Date(Date.now());
        userDto.userId = 1;
        userDto.activatedAccount = true;

        const subscriptionDto = new SubscriptionDto();
        subscriptionDto.id = 1;
        subscriptionDto.expirationDate = new Date(Date.now());
        subscriptionDto.item = itemDto;
        subscriptionDto.user = userDto;

        controller.create(subscriptionDto);
        expect(service.create).toHaveBeenCalledWith(subscriptionDto);
    });
    
    it('calling findAll method', () => {
        controller.findAll();
        expect(service.findAll).toHaveBeenCalled();
    });
    
    it('calling findAllForUser method', () => {
        const req = createRequest({user: { user_id: 1}});
        controller.findAllForUser(req);
        expect(service.findAllForUser).toHaveBeenCalledWith(1);
    });

    it('calling findAllForOwner method', () => {
        const req = createRequest({user: { user_id: 1}});
        controller.findAllForOwner(req);
        expect(service.findAllForOwner).toHaveBeenCalledWith(1);
    });
    
    it('calling findOne method', () => {
        controller.findOne(1);
        expect(service.findOne).toHaveBeenCalledWith(1);
    });
    
    it('calling remove method', () => {
        controller.remove(1);
        expect(service.remove).toHaveBeenCalledWith(1);
    });

})