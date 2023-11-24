import { Test, TestingModule } from "@nestjs/testing";
import { AdminController } from "./admin.controller";
import { UserService } from "../user/user.service";
import {PurchaseCodeService} from '../purchaseCode/purchaseCode.service';
import {TransactionService} from '../transaction/transaction.service';
import {FreeSubscriptionService} from "../free-subscription/free-subscription.service";
import { EmailService } from 'src/email/email.service';
import { RolesGuard } from "../auth/guards/roles.guard";
import { createMock } from "@golevelup/ts-jest";
import { createRequest } from "node-mocks-http";
import { UserDto } from "src/user/user.dto";
import { ItemDto } from "src/item/item.dto";
import { Roles } from "src/roles/role.enum";

describe('AdminController', () => {

    let controller: AdminController
    let userService: UserService
    let pcService: PurchaseCodeService
    let transactService: TransactionService
    let freeSubService: FreeSubscriptionService
    let emailService: EmailService

    let initUser1: UserDto = {
        userId: 1,
        firstName: "test",
        lastName: "user1",
        email: "blah@test.com",
        password: "password",
        role: Roles.User,
        activatedAccount: true,
    }

    let initUser2: UserDto = {
        userId: 2,
        firstName: "test",
        lastName: "user2",
        email: "blee@test.com",
        password: "password",
        role: Roles.User,
        activatedAccount: true,
    }

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
            controllers: [AdminController],
            providers: [
              UserService, 
              { 
                provide: UserService, 
                useValue: createMock<UserService>(),
              },
              PurchaseCodeService,
              {
                provide: PurchaseCodeService,
                useValue: createMock<PurchaseCodeService>(),
              },
              TransactionService,
              {
                provide: TransactionService,
                useValue: createMock<TransactionService>(),
              },
              FreeSubscriptionService,
              {
                provide: FreeSubscriptionService,
                useValue: createMock<FreeSubscriptionService>(),
              },
              EmailService,
              {
                provide: EmailService,
                useValue: createMock<EmailService>(),
              },
              RolesGuard
            ]
          }).compile();
      
          controller = module.get<AdminController>(AdminController)
          userService = module.get<UserService>(UserService)
          pcService = module.get<PurchaseCodeService>(PurchaseCodeService)
          transactService = module.get<TransactionService>(TransactionService)
          freeSubService = module.get<FreeSubscriptionService>(FreeSubscriptionService)
          emailService = module.get<EmailService>(EmailService)
        });

    afterAll(() => {
        jest.clearAllMocks();
    });
    
    it('should be defined', () => {
        expect(controller).toBeDefined();
    });

    it('calling findAllUser method', () => {
        controller.findAllUser();
        expect(userService.findAll).toHaveBeenCalled();
    });

    it('calling deleteUser method', () => {
        controller.deleteUser(1);
        expect(userService.deleteOne).toHaveBeenCalledWith(1);
    });

    it('calling updateUser method', () => {
        const newInfo: UserDto = {
            firstName: "newName",
            lastName: "for_user1",
            email: "blah@test.com",
            password: "password",
            role: Roles.User,
            activatedAccount: true,
        }
        controller.updateUser(newInfo)
        expect(userService.updateOne).toHaveBeenCalledWith(newInfo)
    });

    it('calling sendAccountActivationEmail method', () => {
        controller.sendAccountActivationEmail(initUser2)
        expect(emailService.sendActivateAccountEmail)
            .toHaveBeenCalledWith(initUser2)
    });

    it('calling findAllTransaction method', () => {
        controller.findAllTransaction()
        expect(transactService.findAll).toHaveBeenCalled()
    });

    it('calling findAllFreeEmailSub method', () => {
        controller.findAllFreeEmailSub()
        expect(freeSubService.findAll).toHaveBeenCalled()
    });

    it('calling addEmailSub method', () => {
        const input = {suffix: "test.com"}
        controller.addEmailSub(input)
        expect(freeSubService.addOne).toHaveBeenCalledWith(input.suffix)
    });

    it('calling updateFreeSub method', () => {
        const newSuf = {suffix: "new.com"}
        controller.updateFreeSub(1, newSuf)
        expect(freeSubService.updateEmailSub).toHaveBeenCalledWith(1, newSuf.suffix)
    });

    it('calling deleteEmailSub method', () => {
        controller.deleteEmailSub(1)
        expect(freeSubService.deleteEmailSub).toHaveBeenCalledWith(1)
    });
})