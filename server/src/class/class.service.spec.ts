import { Repository } from 'typeorm'
import { getRepositoryToken } from '@nestjs/typeorm'
import { createMock } from '@golevelup/ts-jest'
import { ClassService } from './class.service'
import { Test, TestingModule } from '@nestjs/testing'
import { ClassController } from './class.controller'
import { UserService } from '../user/user.service'
import { ClassEntity } from './class.entity'
import { UserEntity } from '../user/entities/user.entity'
import { Roles } from "src/roles/role.enum";
import { SubscriptionEntity } from "src/subscription/subscription.entity";
import { ItemEntity } from "src/item/item.entity";
import { SubscriptionService } from 'src/subscription/subscription.service'


export type MockType<T> = {
    [P in keyof T]: jest.Mock<{}>;
};

describe('ClassService', () => {
    let service: ClassService
    let classRepoMock: MockType<Repository<ClassController>>
    let userRepoMock: MockType<Repository<UserService>>
    let subsRepoMock: MockType<Repository<SubscriptionService>>
    let controller: ClassController
    let mockedInstructorEntity = createMock<UserEntity>()
    //mockedInstructorEntity.subscriptions = []

    let mockedClassEntity = createMock<ClassEntity>()
    mockedClassEntity.instructor = mockedInstructorEntity
    //mockedClassEntity.students = []

    let mockedStudentEntity = createMock<UserEntity>()
    //mockedStudentEntity.class = mockedClassEntity
    //mockedStudentEntity.subscriptions = []

    // let mockedSubscriptionEntity_UserOwner: SubscriptionEntity
    // let mockedSubscriptionEntity_InstrOwner: SubscriptionEntity
    // let mockedItemEntity: ItemEntity

    beforeAll(async () => {
        const module: TestingModule = await Test.createTestingModule({
        providers: [
            ClassService,
            {
                provide: getRepositoryToken(ClassEntity),
                useValue: createMock<ClassEntity>(),
            },
            {
                provide: getRepositoryToken(UserEntity),
                useValue: createMock<UserEntity>(),
            },
            {
                provide: getRepositoryToken(SubscriptionEntity),
                useValue: createMock<SubscriptionEntity>(),
            },
        ],
    }).compile();
        const today = new Date()
        service = module.get<ClassService>(ClassService)
        classRepoMock = module.get(getRepositoryToken(ClassEntity))
        userRepoMock = module.get(getRepositoryToken(UserEntity))
        subsRepoMock = module.get(getRepositoryToken(SubscriptionEntity))

        // mockedItemEntity = new ItemEntity()
        // mockedItemEntity.name = "Interactive Textbook"
        // mockedItemEntity.price = 50
        // mockedItemEntity.subscriptionLengthMonths = 3

        mockedInstructorEntity.firstName = "test"
        mockedInstructorEntity.lastName = "instructor"
        mockedInstructorEntity.email = "instructor@tester.com"
        mockedInstructorEntity.passwordHash = "blank"
        mockedInstructorEntity.activatedAccount = true
        mockedInstructorEntity.role = Roles.Instructor
        mockedInstructorEntity.transactions = []
        mockedInstructorEntity.subscriptions = []
        
        mockedStudentEntity.firstName = "test"
        mockedStudentEntity.lastName = "user1"
        mockedStudentEntity.email = "user1@tester.com"
        mockedStudentEntity.passwordHash = "blank"
        mockedStudentEntity.activatedAccount = true
        mockedStudentEntity.role = Roles.User
        mockedStudentEntity.transactions = []
        mockedStudentEntity.subscriptions = []

        // mockedSubscriptionEntity_InstrOwner = new SubscriptionEntity()
        // mockedSubscriptionEntity_InstrOwner.item = mockedItemEntity
        // mockedSubscriptionEntity_InstrOwner.user = mockedStudentEntity
        // mockedSubscriptionEntity_InstrOwner.owner = mockedInstructorEntity
        // mockedSubscriptionEntity_InstrOwner.expirationDate = today
        
        // mockedSubscriptionEntity_UserOwner = new SubscriptionEntity()
        // mockedSubscriptionEntity_UserOwner.item = mockedItemEntity
        // mockedSubscriptionEntity_UserOwner.user = mockedStudentEntity
        // mockedSubscriptionEntity_UserOwner.owner = mockedStudentEntity
        // mockedSubscriptionEntity_UserOwner.expirationDate = today

        mockedClassEntity.students = [];
        mockedClassEntity.instructor = mockedInstructorEntity;
    });

    afterAll(() => {
        jest.clearAllMocks();
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    it('should create a new class (no given instructor id)', async () => {
        const result = new ClassEntity();
        jest.spyOn(classRepoMock, 'save').mockImplementation(() => result)
        jest.spyOn(classRepoMock, 'create').mockImplementation(() => result)
        expect(await service.createNewClass()).toBe(result)
    });

    it('should create a new class (with given instructor id)', async () => {
        jest.spyOn(classRepoMock, 'create').mockImplementation(() => mockedClassEntity)
        jest.spyOn(classRepoMock, 'save').mockImplementation(() => mockedClassEntity)
        jest.spyOn(userRepoMock, 'findOne').mockImplementation(() => mockedClassEntity)
        expect(await service.createNewClass(1)).toBe(mockedClassEntity)
    });

    it('should getAllClasses', async () => {
        jest.spyOn(classRepoMock, 'find').mockImplementation(() => true)
        expect(await service.getAllClasses()).toBe(true)
    });

    it('should getClassById', async () => {
        jest.spyOn(classRepoMock, 'findOne').mockImplementation(() =>mockedClassEntity)
        expect(await service.getClassById(1)).toBe(mockedClassEntity)
    });

    it('should getClassByUserIdOfInstructor', async () => {
        jest.spyOn(classRepoMock, 'findOne').mockImplementation(() =>mockedClassEntity)
        expect(await service.getClassByUserIdOfInstructor(1)).toBe(mockedClassEntity)
    });

    it('should addStudentToClass', async () => {
        jest.spyOn(classRepoMock, 'findOne').mockImplementation(() => mockedClassEntity)
        jest.spyOn(userRepoMock, 'findOne').mockImplementation(() => mockedStudentEntity)
        jest.spyOn(classRepoMock, 'save').mockImplementation(() => true)
        expect(await service.addStudentToClass(1, "blah@test.com")).toBe(true)
    });

    it('should addMultipleStudentsToClass', async () => {
        jest.spyOn(classRepoMock, 'findOne').mockImplementation(() => mockedClassEntity)
        jest.spyOn(userRepoMock, 'findOne').mockImplementation(() => mockedStudentEntity)
        jest.spyOn(classRepoMock, 'save').mockImplementation(() => true)
        expect(await service.addMultipleStudentsToClass([1,2], 2)).toBe(true)
    });

    it('should removeStudentFromClass', async () => {
        jest.spyOn(classRepoMock, 'findOne').mockImplementation(() => true)
        jest.spyOn(userRepoMock, 'findOne').mockImplementation(() => mockedStudentEntity)
        jest.spyOn(classRepoMock, 'save').mockImplementation(() => true)
        expect(await service.removeStudentFromClass(1, 2)).toBe(true)
    });

});