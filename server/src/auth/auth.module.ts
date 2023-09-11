import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UserModule } from "../user/user.module";
import { PassportModule } from "@nestjs/passport";
import { LocalStrategy } from "./local.strategy";
import { JwtStrategy } from "./jwt.strategy";
import { AuthController } from './auth.controller';
import { JwtModule } from "@nestjs/jwt"
import { jwtConstants } from "./constants";
import { ClassService } from 'src/class/class.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClassEntity } from 'src/class/class.entity';
import { ClassController } from 'src/class/class.controller';
import { UserEntity } from 'src/user/entities/user.entity';

@Module({
  imports:[
    UserModule,
    PassportModule,
    TypeOrmModule.forFeature([ClassEntity, UserEntity]),
    JwtModule.register({
      //todo put secret in env file
      secret:jwtConstants.secret,
      signOptions: {expiresIn:'7d'}
    })],
  controllers: [AuthController, ClassController],
  providers: [AuthService,LocalStrategy,JwtStrategy,ClassService],
  exports:[AuthService]

})
export class AuthModule {}
