import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post } from "@nestjs/common";
import {ClassService} from "./class.service";

@Controller('classes')
export class ClassController {
  constructor(private readonly classService: ClassService) {}

  @Get()
  async getAllClasses() {
    return this.classService.getAllClasses();
  }

  @Get(":classId")
  async getClassById(@Param("classId") classId: number) {
    return this.classService.getClassById(classId);
  }

  @Get('/instructor/:instructorId')
  async getClassForInstructor(@Param("instructorId") instructorId: number) {
    return this.classService.getClassByUserIdOfInstructor(instructorId);
  }

  @Post(":classId/student")
  @HttpCode(HttpStatus.CREATED)
  async addStudentToClass(@Param("classId") classId: number, @Body("email") studentEmail: string) {
    return this.classService.addStudentToClass(classId, studentEmail);
  }

  @Delete(':classId/student/:studentUserId')
  @HttpCode(HttpStatus.OK) // returns the class with the student removed
  async removeStudent(@Param("classId") classId: number, @Param("studentUserId") studentUserId: number) {
    return this.classService.removeStudentFromClass(classId, studentUserId);
  }

}