import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    readonly usersService: UsersService,
    readonly jwtService: JwtService
  ) {}

  async register(username: string, password: string) {
    const user = await this.usersService.createUser(username, password);
    const payload = { username: user.username, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }

  async login(username: string, password: string) {
    const user = await this.usersService.validateUser(username, password);
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const payload = { username: user.username, sub: user.id };
    return { access_token: this.jwtService.sign(payload) };
  }
}
