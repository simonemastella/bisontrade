import { Controller, Get, Post, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Type, Static } from '@sinclair/typebox';
import { Validate } from 'nestjs-typebox';
import { Auth, AuthenticatedRequest } from './auth.decorator';

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
  constructor(readonly authService: AuthService) {}

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

  @Get('protected')
  @Auth()
  @Validate({
    response: {
      responseCode: 200,
      schema: Type.Object({ message: Type.String() }),
    },
  })
  prot(@Req() req: AuthenticatedRequest) {
    return {
      message: `hello ${JSON.stringify(req.user)}`,
    };
  }
}
