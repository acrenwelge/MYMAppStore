import User from "./user";

export default interface Class {
  classId: number;
  instructor: User;
  students: User[];
}