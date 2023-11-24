import { Test, TestingModule } from '@nestjs/testing'
import { UserService } from './user.service'
import {UserEntity} from "../user/entities/user.entity"
import {Repository} from "typeorm"
import {MockType} from "../transaction/transaction.service.spec"
import { getRepositoryToken } from '@nestjs/typeorm'
import { createMock } from '@golevelup/ts-jest'
import {EmailService} from "../email/email.service"
import { hash } from 'bcrypt'
import { SubscriptionService } from 'src/subscription/subscription.service'
import { UserDto } from './user.dto'
import { NotFoundException, ConflictException, UnauthorizedException } from '@nestjs/common'

describe('UserService', () => {
	let service: UserService
	let emailservice: EmailService
	let repositoryMock: MockType<Repository<UserEntity>>

	beforeAll(async () => {
		const module: TestingModule = await Test.createTestingModule({
			providers: [
					UserService,
					{
						provide: SubscriptionService,
						useValue: createMock<SubscriptionService>(),
					},
					{
						provide: EmailService,
						useValue: createMock<EmailService>(),
					},
					{
						provide: getRepositoryToken(UserEntity),
						useValue: createMock<UserEntity>(),
					}
		],
		}).compile()
		service = module.get<UserService>(UserService)
		emailservice = module.get<EmailService>(EmailService)
		repositoryMock = module.get(getRepositoryToken(UserEntity))
	});

	afterAll(() => {
		jest.clearAllMocks()
	})

	it('should be defined', () => {
		expect(service).toBeDefined()
	})

	it('should signup locally', async () => {
		const testUser = new UserEntity()
		testUser.email = "testing@mail.com"
		const userClient = new UserDto()
		userClient.email = "testing@mail.com"
		jest.spyOn(repositoryMock, 'exist').mockImplementation(() => false)
		jest.spyOn(repositoryMock, 'save').mockImplementation(() => testUser)
		jest.spyOn(emailservice, 'sendActivateAccountEmail').mockReturnValue(Promise.resolve())
		expect((await service.localSignUp(userClient)).email).toBe(testUser.email)
	})

	it('should not signup existing locally', async () => {
		const userClient = new UserDto()
		const err = new ConflictException("User email address already exists")
		jest.spyOn(repositoryMock, 'exist').mockImplementation(() => true)
		await expect(service.localSignUp(userClient)).rejects.toEqual(err)
	})

	it('should not have a password less than 12 chars', async () => {
		const err = new ConflictException("User password invalid")
		const userClient = new UserDto()
		userClient.email = "testing@mail.com"
		userClient.password = "12345"
		jest.spyOn(repositoryMock, 'exist').mockImplementation(() => false)
		await expect(service.localSignUp(userClient)).rejects.toEqual(err)
	})
	it('should not have a password that repeats 4 or more chars', async () => {
		const err = new ConflictException("User password invalid")
		const userClient = new UserDto()
		userClient.email = "testing@mail.com"
		userClient.password = "applesapplesapples"
		jest.spyOn(repositoryMock, 'exist').mockImplementation(() => false)
		await expect(service.localSignUp(userClient)).rejects.toEqual(err)
	})

	it('should sign up for a class', async () => {
		const UserA = new UserDto()
		const UserB = new UserDto()
		jest.spyOn(service, 'localSignUp').mockReturnValueOnce(Promise.resolve(UserA))
										.mockReturnValueOnce(Promise.resolve(UserB))
		const users = [UserA, UserB]
		await expect(service.localSignUpForClass(users)).resolves.not.toThrow()
	})

	it('should generate activation code', async () => {
		const username = "banana"
		jest.spyOn(Date, 'now').mockImplementation(() => 1697156101082)
		expect((await service.generateActivationCode(username))).toBe("MYCode1697156101082ncclovekk")
	})

	it('should authenticate a user', async () => {
		const password = "abcdefghijklmn"
		const result = new UserDto()
		result.email = "test@mail.com"
		result.password = password
		const foundUser = new UserEntity()
		foundUser.email = "test@mail.com"
		foundUser.passwordHash = await hash(password,10)
		jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => foundUser)
		expect(await service.authenticate(result)).toBe(foundUser)
	})

	it('should activate an account', async () => {
		const activcode = "a"
		const olduser = new UserEntity()
		olduser.activationCode = activcode
		olduser.activatedAccount = false
		const newuser = new UserEntity()
		newuser.activationCode = activcode
		newuser.activatedAccount = true
		jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => olduser)
		jest.spyOn(repositoryMock, 'save').mockImplementation(() => newuser)
		expect(await service.activateAccount(newuser.activationCode)).toStrictEqual(newuser)
	})

	it('should deactivate an account', async () => {
		const newuser = new UserEntity()
		newuser.activatedAccount = true
		jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => newuser)
		jest.spyOn(repositoryMock, 'save').mockImplementation(() => newuser)
		expect((await service.deactivateAccount(10)).activatedAccount).toStrictEqual(false)
	})

	it('should not deactivate an account that does not exist', async () => {
		const err = new NotFoundException()
		const newuser = new UserEntity()
		newuser.activatedAccount = true
		jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => null)
		await expect(service.deactivateAccount(10)).rejects.toEqual(err)
	})

	it('should find all user', async () => {
		const userList = []
		const user = new UserEntity()
		user.email = "banana@gmail.com"
		userList.push(user)
		user.email = "temporary@mail.com"
		userList.push(user)
		jest.spyOn(repositoryMock, 'find').mockImplementation(() => userList)
		expect((await service.findAll()).pop().email).toBe(userList[1].email)
	})

	it('should find one user by email', async () => {
		const result = new UserEntity()
		result.email = "ncc@me.com"
		jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => result)
		expect(await service.findOneByEmail("ncc@me.com")).toBe(result)
	})

	it('should find one user by id', async () => {
		const result = new UserEntity()
		result.email = "ncc@me.com"
		jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => result)
		expect(await service.findOneById(35)).toBe(result)
	})

	it('should hash a password', async () => {
		const plaintext = "123"
		const res = await hash(plaintext, 10)
		console.log(res)
		expect(res).toHaveLength(60)
	})

	it('should delete a user', async () => {
		jest.spyOn(repositoryMock, 'delete').mockImplementation(() => null)
		await service.deleteOne(1)
		expect(repositoryMock.delete).toBeCalledWith(1)
	})

	it('should change first and last name', async () => {
		const oldUser = new UserEntity()
		oldUser.email = "testtest@mail.com"
		oldUser.firstName = "Testing"
		oldUser.lastName = "Bad name"
		const user = new UserDto()
		user.email = "testtest@mail.com"
		user.firstName = "John"
		user.lastName = "Doe"
		jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => oldUser)
		jest.spyOn(repositoryMock, 'update').mockImplementation(() => null)
		expect((await service.updateOne(user)).firstName).toBe(user.firstName)
	})

	it('should change password', async () => {
		const user = new UserEntity()
		user.email = "testtest@mail.com"
		const update = new UserDto()
		update.email = "testtest@mail.com"
		update.password = "applesButter32Game"
		jest.spyOn(repositoryMock, 'findOne').mockImplementation(() => user)
		jest.spyOn(repositoryMock, 'update').mockImplementation(() => null)
		// We have the same expectation that the password hash test does
		expect((await service.updateOne(update)).passwordHash).toHaveLength(60)
	})

})

