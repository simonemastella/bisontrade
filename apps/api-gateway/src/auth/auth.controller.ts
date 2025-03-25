import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiBody, ApiProperty, ApiResponse } from '@nestjs/swagger';

class LoginResponseDto {
  @ApiProperty({ example: 'eyJhbGciOiJIUzI1NiIsInR...' })
  access_token!: string;
}

class LoginDto {
  @ApiProperty({ example: 'testuser' })
  username!: string;

  @ApiProperty({ example: 'password123' })
  password!: string;
}

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  register(
    @Body('username') username: string,
    @Body('password') password: string
  ) {
    return this.authService.register(username, password);
  }

  @Post('login')
  @ApiBody({ type: LoginDto }) // 👈 Explicitly define the request body
  @ApiResponse({ status: 200, type: LoginResponseDto })
  login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto.username, loginDto.password);
  }
}
