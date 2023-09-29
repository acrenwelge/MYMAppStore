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


export type MockType<T> = {
    [P in keyof T]: jest.Mock<{}>;
};

describe('ClassService', () => {
    let service: ClassService
    let classRepoMock: MockType<Repository<ClassController>>
    let userRepoMock: MockType<Repository<UserService>>
    let controller: ClassController
    let mockedClassEntity: ClassEntity
    let mockedUserEntity: UserEntity

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
            }
        ],
    }).compile();

        service = module.get<ClassService>(ClassService)
        classRepoMock = module.get(getRepositoryToken(ClassEntity))
        userRepoMock = module.get(getRepositoryToken(UserEntity))

        mockedClassEntity = new ClassEntity()
        const today = new Date()
        mockedUserEntity = {
            userId: 1,
            firstName: "test",
            lastName: "test",
            email: "tester@tester.com",
            passwordHash: "blank",
            activatedAccount: true,
            createdAt: today,
            updatedAt: today,
            role: Roles.Instructor,
            transactions: [],
            class: null
        }
        mockedClassEntity.instructor = mockedUserEntity
        mockedClassEntity.students = []
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
        jest.spyOn(userRepoMock, 'findOne').mockImplementation(() => mockedUserEntity)
        jest.spyOn(classRepoMock, 'save').mockImplementation(() => true)
        expect(await service.addStudentToClass(1, "blah@test.com")).toBe(true)
    });

    it('should addMultipleStudentsToClass', async () => {
        jest.spyOn(classRepoMock, 'findOne').mockImplementation(() => mockedClassEntity)
        jest.spyOn(userRepoMock, 'findOne').mockImplementation(() => mockedUserEntity)
        jest.spyOn(classRepoMock, 'save').mockImplementation(() => true)
        expect(await service.addMultipleStudentsToClass([1,2], 2)).toBe(true)
    });

    it('should removeStudentFromClass', async () => {
        jest.spyOn(classRepoMock, 'findOne').mockImplementation(() => true)
        jest.spyOn(userRepoMock, 'findOne').mockImplementation(() => mockedUserEntity)
        jest.spyOn(classRepoMock, 'save').mockImplementation(() => true)
        expect(await service.removeStudentFromClass(1, 2)).toBe(true)
    });

});