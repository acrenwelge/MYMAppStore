import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { ClassEntity } from "./class.entity";
import { Repository } from "typeorm";
import { UserEntity } from "src/user/entities/user.entity";
import { SubscriptionEntity } from "src/subscription/subscription.entity";

@Injectable()
export class ClassService {

  constructor(
    @InjectRepository(ClassEntity) private readonly classRepo: Repository<ClassEntity>,
    @InjectRepository(UserEntity) private readonly userRepo: Repository<UserEntity>,
    @InjectRepository(SubscriptionEntity) private readonly subscRepo: Repository<SubscriptionEntity>
  ) {}

  async createNewClass(instructorId?: number) {
    let newClass = this.classRepo.create()
    if (instructorId) {
      const instructor = await this.userRepo.findOne({where: {userId: instructorId}})
      newClass.instructor = instructor
    }
    return await this.classRepo.save(newClass)
  }

  async getAllClasses() {
    return await this.classRepo.find({relations: ['instructor', 'students']})
  }

  async getClassById(id: number) {
    return await this.classRepo.findOne({
      relations: ['instructor', 'students'], 
      where: {classId: id}
    })
  }

  async getClassByUserIdOfInstructor(userIdOfInstructor: number) {
    const classEntity = await this.classRepo.findOne({
      relations: ['instructor', 'students', 'students.usingSubscriptions', 
      'students.usingSubscriptions.owner'],
      where: {instructor: {userId: userIdOfInstructor} }
    })
    return classEntity;
  }

  async addStudentToClass(classId: number, studentEmail: string) {
    let classEntity = await this.classRepo.findOne({
      relations: ['instructor', 'students', 'students.usingSubscriptions', 
      'students.usingSubscriptions.owner'],
      where: {classId}
    })
    
    console.log(classId)
    console.log("classEntity = ", classEntity)
    let userEntity = await this.userRepo.findOne({
      relations: ['usingSubscriptions', 'usingSubscriptions.owner'],
      where: { email: studentEmail }
    })
    
    if (!userEntity) {
      throw new Error(`No user with email ${studentEmail} found.`)
    }
    console.log("userEntity.userId = ", userEntity.userId)
    classEntity.students.push(userEntity)
    return await this.classRepo.save(classEntity)
  }

  async addMultipleStudentsToClass(studentIds: number[], classId: number) {
    let classEntity = await this.classRepo.findOne({where: {classId}})
    for (const sid of studentIds) {
      const userEntity = await this.userRepo.findOne({where: {userId: sid}})
      // classEntity.students.push(userEntity)
    }
    return this.classRepo.save(classEntity)
  }

  async removeStudentFromClass(classId: number, studentUserId: number) {
    let studentEntity = await this.userRepo.findOne({
      relations: ['class', 'usingSubscriptions', 'usingSubscriptions.owner'],
      where: {userId: studentUserId}
    })
    studentEntity.class = null // unassign student from class
    await this.userRepo.save(studentEntity)
    return await this.classRepo.findOne({
      relations: ['instructor','students', 'students.usingSubscriptions', 
      'students.usingSubscriptions.owner'],
      where: {classId}
    })
  }
}