import { Test, TestingModule } from '@nestjs/testing';
import { RecordController } from './record.controller';
import { RecordService } from './record.service';
import { Record } from './entities/record.entity';
import { createMock } from '@golevelup/ts-jest';
import { CreateRecordDto } from './dto/create-record.dto';
import { createRequest } from 'node-mocks-http';

describe('RecordController', () => {
  let controller: RecordController;
  let service: RecordService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [RecordController],
      providers: [
        RecordService,
        {
          provide: RecordService,
          useValue: createMock<RecordService>(),
        }
      ]
    }).compile();

    controller = module.get<RecordController>(RecordController);
    service = module.get<RecordService>(RecordService);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calling create method', () => {
    const dto: CreateRecordDto = new CreateRecordDto();
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
    expect(service.findAll).toHaveBeenCalledWith(+userid);
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
    const rec = new Record();
    controller.update(id, user_id, item_id);
    expect(service.update).toBeCalledWith(user_id, item_id);
  });

  it('calling remove method', () => {
    const id = '123';
    controller.remove(id);
    expect(service.remove).toHaveBeenCalledWith(+id);
  });

});
