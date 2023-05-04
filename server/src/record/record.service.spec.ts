import { RecordService } from './record.service';
import { Record } from "./entities/record.entity";
import { Repository } from 'typeorm';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CreateRecordDto } from './dto/create-record.dto';
import { createMock } from '@golevelup/ts-jest';
//import {Transaction} from "../transaction/entities/transaction.entity";
//import {MockType} from "../transaction/transaction.service.spec";

describe('RecordService', () => {
  let service: RecordService;
  let repositoryMock: MockType<Repository<Record>>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RecordService,
        {
          provide: getRepositoryToken(Record),
          useValue: createMock<Record>(),
        }
      ],
    }).compile();

    service = module.get<RecordService>(RecordService);
    repositoryMock = module.get(getRepositoryToken(Record));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});

export type MockType<T> = {
  [P in keyof T]: jest.Mock<{}>;
};
