import { createMock } from '@golevelup/ts-jest';
import { ClassService } from './class.service';
import { Test, TestingModule } from '@nestjs/testing';
import { ClassController } from './class.controller';


describe('ClassController', () => {
  let controller: ClassController;
  let service: ClassService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ClassController],
      providers: [
        ClassService, 
        { 
          provide: ClassService, 
          useValue: createMock<ClassService>(),
        }
      ]
    }).compile();

    controller = module.get<ClassController>(ClassController);
    service = module.get<ClassService>(ClassService);
  });

  afterAll(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('calling getAllClasses method', () => {
    controller.getAllClasses()
    expect(service.getAllClasses).toHaveBeenCalled()
  });

  it('calling getClassById method', () => {
    const id = 1
    controller.getClassById(id)
    expect(service.getClassById).toHaveBeenCalledWith(id)
  });

  it('calling getClassForInstructor method', () => {
    const instructorId = 123
    controller.getClassForInstructor(instructorId)
    expect(service.getClassByUserIdOfInstructor).toHaveBeenCalledWith(instructorId)
  });

  it('calling addStudentToClass method', () => {
    const classId = 123
    const email = "test@test.com"
    controller.addStudentToClass(classId, email)
    expect(service.addStudentToClass).toHaveBeenCalledWith(classId, email)
  });

  it('calling removeStudent method', () => {
    const classId = 123
    const studentUserId = 321
    controller.removeStudent(classId, studentUserId)
    expect(service.removeStudentFromClass).toHaveBeenCalledWith(classId, studentUserId)
  });

});
