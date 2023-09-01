import {Body, Controller, Get, HttpCode, Post, Request, UnauthorizedException, UseGuards} from '@nestjs/common';
import {UserService} from "../user/user.service";
import {AuthGuard} from "@nestjs/passport";
import {LocalAuthGuard} from "./guards/local-auth.guard";
import {AuthService} from "./auth.service";
import {JwtAuthGuard} from "./guards/jwt-auth.guard";
import { UserDto } from 'src/user/user.dto';

@Controller('auth')
export class AuthController {
    constructor(private readonly userService: UserService,
                private authService:AuthService) {}

    @HttpCode(200)
    @Post("local-signup")
    create(@Body() user: UserDto) {
        return this.userService.localSignUp(user);
    }

    @HttpCode(200)
    @Post("class-signup")
    signUpStudents(@Body() newUsers: UserDto[]) {
        console.log(newUsers);
        return this.userService.localSignUpForClass(newUsers);
    }

    @Post("local-login")
    @HttpCode(200)
    @UseGuards(LocalAuthGuard)
    // local strategy has a default name of 'local'. code supplied by the passport-local package
    public async localLogin(@Body() user: UserDto) {
        console.log("user:",user)
        return this.authService.login(user)
    }

    @HttpCode(200)
    @UseGuards(JwtAuthGuard)
    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }

    @HttpCode(200)
    @Post("activate")
    activateAccount(@Body() body: {activationCode: string}) {
        return this.userService.activateAccount(body.activationCode);
    }

}
