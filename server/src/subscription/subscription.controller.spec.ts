import { Test, TestingModule } from '@nestjs/testing';
import { SubscriptionController } from './subscription.controller';
import { SubscriptionService } from './subscription.service';
import { SubscriptionEntity } from './subscription.entity';
import { createMock } from '@golevelup/ts-jest';
import { SubscriptionDto } from './subscription.dto';
import { createRequest } from 'node-mocks-http';

describe('RecordController', () => {
  let controller: SubscriptionController;
  let service: SubscriptionService;

  beforeEach(async () => {
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
    const dto: SubscriptionDto = new SubscriptionDto();
    controller.create(dto);
    expect(service.create).toHaveBeenCalledWith(dto);
  });


  it('calling findAll method', () => {
    const userid = 1;
    const req = createRequest({
      user: {
        user_id: userid,
      }
    });

    controller.findAll(req);
    expect(service.findAllForUser).toHaveBeenCalledWith(+userid);
  });

  it('calling findOne method', () => {
    const id = '123';
    controller.findOne(id);
    expect(service.findOne).toHaveBeenCalledWith(+id);
  });

  it('calling update method', () => {
    const id = "123";
    const user_id = 1;
    const item_id = 1;
    const rec = new SubscriptionEntity();
    controller.update(id, user_id, item_id);
    expect(service.update).toBeCalledWith(user_id, item_id);
  });

  it('calling remove method', () => {
    const id = '123';
    controller.remove(id);
    expect(service.remove).toHaveBeenCalledWith(+id);
  });

});
