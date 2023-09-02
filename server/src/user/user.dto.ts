import { Roles } from "src/roles/role.enum";

/**
 * User Data Transfer Object - sent to/from the client
 * @property userId - the user's unique identifier
 * @property firstName - the user's first name
 * @property lastName - the user's last name
 * @property email - the user's email address
 * @property password - the user's plaintext password
 * @property role - allowable values: "admin", "instructor", "user"
 */
export class UserDto {
  userId?: number;
  firstName: string;
  lastName: string;
  email: string;
  password?: string;
  role?: Roles;
  activatedAccount?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}