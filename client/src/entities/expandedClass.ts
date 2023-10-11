import ExpandedUser from "./expandedUser";

export default interface ExpandedClass {
  classId: number;
  instructor: ExpandedUser;
  students: ExpandedUser[];
}