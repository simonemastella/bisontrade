import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Type, Static } from '@sinclair/typebox';
import { Validate } from 'nestjs-typebox';

const AuthResponse = Type.Object(
  {
    access_token: Type.String(),
  },
  { additionalProperties: false }
);
type TAuthResponse = Static<typeof AuthResponse>;

const AuthRequest = Type.Object(
  {
    username: Type.String(),
    password: Type.String(),
  },
  { additionalProperties: false }
);
type TAuthRequest = Static<typeof AuthRequest>;

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Validate({
    request: [{ type: 'body', schema: AuthRequest, name: 'body' }],
    response: { responseCode: 200, schema: AuthResponse },
  })
  register(body: TAuthRequest): Promise<TAuthResponse> {
    return this.authService.register(body.username, body.password);
  }

  @Post('login')
  @Validate({
    request: [{ type: 'body', schema: AuthRequest, name: 'body' }],
    response: { responseCode: 200, schema: AuthResponse },
  })
  login(body: TAuthRequest): Promise<TAuthResponse> {
    return this.authService.login(body.username, body.password);
  }
}
