import { Injectable } from '@nestjs/common';
import { UserService } from './../user/user.service';
import { JwtService} from "@nestjs/jwt";
import { UserDto } from 'src/user/user.dto';

@Injectable()
export class AuthService {
    constructor(
        private userService: UserService,
        private jwtService:JwtService
    ) {}

    async validateUserByEmail(email: string, hash: string): Promise<any> {
        const user = await this.userService.findOneByEmail(email);
        if (user && user.passwordHash === hash) {
            return user
        }
        return null;
    }

    async login(user: UserDto) {
        console.log("logging in user:",user)
        const userEntity = await this.userService.findOneByEmail(user.email);
        const payload = {email: userEntity.email, sub: userEntity.userId, role: userEntity.role}
        return {
            user: userEntity,
            access_token: this.jwtService.sign(payload)
        }
    }


}
