import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';

/**
 * @description A guard that checks if a user has the required role to access an endpoint.
 */
@Injectable()
export class RolesGuard implements CanActivate {
    constructor(private reflector: Reflector) {}

    canActivate(context: ExecutionContext): boolean {
        const requiredRole = this.reflector.getAllAndOverride<string>('role', [
            context.getHandler(),
            context.getClass(),
        ]);

        if (!requiredRole) {
            return true;
        }
        const request = context.switchToHttp().getRequest();
        const userRole = request.user.role;
        return userRole == requiredRole;
    }
}
