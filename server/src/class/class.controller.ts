import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
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
  async addStudentToClass(@Param("classId") classId: number, @Body("email") studentEmail: string) {
    return this.classService.addStudentToClass(classId, studentEmail);
  }

  @Delete(':classId/student/:studentUserId')
  async removeStudent(@Param("classId") classId: number, @Param("studentUserId") studentUserId: number) {
    return this.classService.removeStudentFromClass(classId, studentUserId);
  }

}