import { SetMetadata } from '@nestjs/common';
import { Roles } from './role.enum';

// sets metadata for the required role of a user when accessing an endpoint
export const NeedRole = (role: Roles) => SetMetadata('role', role);