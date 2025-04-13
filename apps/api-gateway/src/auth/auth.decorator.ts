import { applyDecorators, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ApiBearerAuth } from '@nestjs/swagger';
import { Type, Static } from '@sinclair/typebox';
import { Request } from 'express';

export function Auth() {
  return applyDecorators(UseGuards(AuthGuard('jwt')), ApiBearerAuth());
}

const jwtUserPayload = Type.Object(
  {
    userId: Type.Number(),
    username: Type.String(),
  },
  { additionalProperties: false }
);
export type JWTUserPayload = Static<typeof jwtUserPayload>;

export interface AuthenticatedRequest extends Request {
  user: JWTUserPayload;
}
