import {ConflictException, forwardRef, Inject, Injectable, NotFoundException} from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";
import {EmailService} from "../email/email.service";

@Injectable()
export class UserService {

  constructor(
      @InjectRepository(User)
      private readonly userRepo: Repository<User>,  // 使用泛型注入对应类型的存储库实例
      @Inject(forwardRef(()=> EmailService)) private readonly emailService: EmailService
  ) {}

  async localSignUp(createUser: User) {
    const email = createUser.email
    const user = await this.userRepo.findOne({where: {email}})
    if (user != null) {
      throw new ConflictException("User email address already exists")
    } else {
      createUser.role = 2
      createUser.activatedAccount = false
      createUser.activationCode = this.generateActivationCode(createUser.name)
      const createResult = await this.userRepo.save(createUser)
      return await this.emailService.sendActivateAccountEmail(createResult)
    }
  }

  generateActivationCode(username: string): string {
    if (process.env.EMAIL_ENABLE === 'test') {
      return 'naomi2049'+ username + '114514'
    }  else {
      return 'Naomi2049'+ Date.now().toString()+'ncclovekk'
    }
  }

  async authenticate(loginUser: User): Promise<User> {
    const email = loginUser.email
    const password = loginUser.password
    const user = await this.userRepo.findOne({ where:{email,password} });
    return user || null;
  }

  async activateAccount(activationCode: string): Promise<User | null> {
    const user = await this.userRepo.findOne({ where: { activationCode:activationCode} });
    // console.log(user)
    if (user === null) {
      throw new NotFoundException;
    }
    user.activatedAccount = true;
    await this.userRepo.save(user);
    return user
  }

  async findAll() {
    const users = await this.userRepo.find({
      select:{
        id:true,
        name: true,
        email: true,
        activatedAccount:true,
        createdAt:true
      }
    })
    return users
  }

  async findOneByEmail(email: string): Promise<User | undefined> {
    const user = await this.userRepo.findOne({where: {email}});
    return user || null;
  }

  async findOneById(id: number): Promise<User | undefined> {
    const user = await this.userRepo.findOne({where: {id}});
    return user || null;
  }

  /**
   * Updates a user, with only the fields that are provided
   */
  async updateOne(user: User): Promise<User | undefined> {
    const id = user.id;
    const userToUpdate = await this.userRepo.findOne({where: {id}});
    if (userToUpdate === null) {
      throw new NotFoundException;
    }
    userToUpdate.name = user.name || userToUpdate.name;
    userToUpdate.email = user.email || userToUpdate.email;
    userToUpdate.role = user.role || userToUpdate.role;
    userToUpdate.activatedAccount = user.activatedAccount === undefined ? userToUpdate.activatedAccount : user.activatedAccount;
    userToUpdate.activationCode = user.activationCode || userToUpdate.activationCode;
    userToUpdate.password = user.password || userToUpdate.password;
    console.log(userToUpdate);
    await this.userRepo.update(id,userToUpdate);
    return userToUpdate
  }

  async deleteOne(id: number): Promise<void> {
    (await this.userRepo.delete(id))
  }

}
