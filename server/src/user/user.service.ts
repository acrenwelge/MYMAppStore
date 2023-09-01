import {ConflictException, forwardRef, Inject, Injectable, NotFoundException, UnauthorizedException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {UserEntity} from "./entities/user.entity";
import {Repository} from "typeorm";
import {EmailService} from "../email/email.service";
import {hash, compare} from 'bcrypt';
import { UserDto } from './user.dto';
import { Roles } from 'src/roles/role.enum';
import { SubscriptionService } from 'src/subscription/subscription.service';

@Injectable()
export class UserService {

  constructor(
      @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
      @Inject(forwardRef(()=> EmailService)) private readonly emailService: EmailService,
      @Inject(forwardRef(()=> SubscriptionService)) private readonly subscrService: SubscriptionService,
  ) {}

  /**
   * Inserts a new user into the database after checking that the email address is not already in use
   **/
  async localSignUp(userFromClient: UserDto) {
    const exists = await this.userRepo.exist({where: {email: userFromClient.email}})
    if (exists) {
      console.log(`User email address ${userFromClient.email} already exists`)
      throw new ConflictException("User email address already exists")
    }
    const newUserToCreate = this.userRepo.create(userFromClient)
    const hashed = await hash(userFromClient.password, 10)
    newUserToCreate.passwordHash = hashed
    newUserToCreate.role = Roles.User // default to regular user. TODO: allow admin/instructor roles
    newUserToCreate.activatedAccount = false
    newUserToCreate.activationCode = this.generateActivationCode(userFromClient.firstName + userFromClient.lastName)
    const retUserEntity = await this.userRepo.save(newUserToCreate)
    const retUserDTO = this.convertToUserDTO(retUserEntity)
    return await this.emailService.sendActivateAccountEmail(retUserDTO)
  }

  /**
   * Creates an entire group of users at once
   * Used by instructors to create a class of students
   **/
  async localSignUpForClass(createUsers: UserDto[]) {
    const createResults: Promise<void>[] = []
    console.log(createUsers)
    for (const newUser of createUsers) {
      let res = this.localSignUp(newUser)
      createResults.push(res)
    }
    return Promise.all(createResults)
  }

  generateActivationCode(username: string): string {
    if (process.env.EMAIL_ENABLE === 'test') {
      return 'naomi2049'+ username + '114514'
    }  else {
      return 'Naomi2049'+ Date.now().toString()+'ncclovekk'
    }
  }

  async authenticate(loginUser: UserDto): Promise<UserEntity> {
    const email = loginUser.email
    const password = loginUser.password
    const user = await this.userRepo.findOne({ where:{email} });
    console.log("hashed comparison value:",user.passwordHash)
    console.log("password:",password)
    const validCredentials = await compare(password, user.passwordHash)
    if (!validCredentials) {
      Promise.reject(new UnauthorizedException("Incorrect email or password"))
    }
    return user
  }

  async activateAccount(activationCode: string): Promise<UserEntity | null> {
    const user = await this.userRepo.findOne({ where: { activationCode:activationCode} });
    if (user === null) {
      throw new NotFoundException;
    }
    user.activatedAccount = true;
    await this.userRepo.save(user);
    return user
  }

  async deactivateAccount(userId: number): Promise<UserEntity | null> {
    const user = await this.userRepo.findOne({ where: { userId:userId} });
    if (user === null) {
      throw new NotFoundException;
    }
    user.activatedAccount = false;
    await this.userRepo.save(user);
    return user
  }

  async findAll(): Promise<UserDto[]> {
    const users = await this.userRepo.find({
      select:{
        userId: true,
        firstName: true,
        email: true,
        activatedAccount: true,
        createdAt: true,
        role: true,
      }
    })
    const dtoArr = users.map(user => this.convertToUserDTO(user))
    return Promise.resolve(dtoArr)
  }

  async findOneByEmail(email: string): Promise<UserEntity | undefined> {
    const user = await this.userRepo.findOne({where: {email}});
    return user || null;
  }

  async findOneById(id: number): Promise<UserEntity | undefined> {
    const user = await this.userRepo.findOne({where: {userId: id}});
    return user || null;
  }

  async deleteOne(id: number): Promise<void> {
    (await this.userRepo.delete(id))
  }

  /**
   * Updates a user's profile information, with only the fields that are provided.
   * User email updates are not currently supported because email is a unique user identifier.
   * Account activation/deactivation is not supported here - it must be done through 
   * the {@link UserService.activateAccount} and {@link UserService.deactivateAccount} methods.
   */
  async updateOne(user: UserDto): Promise<UserEntity | undefined> {
    const email = user.email;
    const userToUpdate = await this.userRepo.findOne({where: {email: email}});
    if (userToUpdate === null) {
      throw new NotFoundException;
    }
    if (user.email && user.email !== userToUpdate.email) {
      throw new Error("Unsupported Operation: cannot update user email")
    }
    userToUpdate.firstName = user.firstName || userToUpdate.firstName;
    userToUpdate.lastName = user.lastName || userToUpdate.lastName;
    userToUpdate.role = user.role || userToUpdate.role;
    if (user.password) {
        const hashed = await hash(user.password, 10)
        userToUpdate.passwordHash =  hashed
        console.log(`new password set for user ${user.firstName} ${user.lastName} - ${hashed}`);
    }
    await this.userRepo.update(userToUpdate.userId,userToUpdate);
    return userToUpdate
  }

  // password will not be included in the returned DTO
  private convertToUserDTO(user: UserEntity): UserDto {
    let result = new UserDto()
    result.userId = user.userId
    result.firstName = user.firstName
    result.lastName = user.lastName
    result.email = user.email
    result.role = user.role
    result.activatedAccount = user.activatedAccount
    result.createdAt = user.createdAt
    return result
  }

}
