import {
  Injectable,
  UnauthorizedException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { JWTUserPayload } from './auth.decorator';
import { QueryFailedError } from 'typeorm';

@Injectable()
export class AuthService {
  constructor(
    readonly usersService: UsersService,
    readonly jwtService: JwtService
  ) {}

  async register(username: string, password: string) {
    try {
      const user = await this.usersService.createUser(username, password);
      const payload = { username: user.username, sub: user.id };
      return { access_token: this.jwtService.sign(payload) };
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as any).code === '23505'
      ) {
        // PostgreSQL unique violation code
        throw new BadRequestException('Invalid username');
        //NOTE this could be obfuscated in a generic 500
      }
      throw error;
    }
  }

  async login(username: string, password: string) {
    const user = await this.usersService.validateUser(username, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload: JWTUserPayload = {
      username: user.username,
      userId: user.id,
    };
    return { access_token: this.jwtService.sign(payload) };
  }
}
