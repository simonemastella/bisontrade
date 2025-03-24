import { Type, Static } from '@sinclair/typebox';
import { loadEnv } from '@bisontrade/libs';

const EnvBESchema = Type.Object({
  NODE_ENV: Type.Union([
    Type.Literal('development'),
    Type.Literal('production'),
    Type.Literal('local'),
  ]),
  POSTGRES_PORT: Type.Number({ minimum: 1, maximum: 65535 }),
  POSTGRES_HOST: Type.String(),
  POSTGRES_USER: Type.String(),
  POSTGRES_PASSWORD: Type.String(),
  POSTGRES_DB: Type.String(),
  JWT_SECRET: Type.String({ minLength: 64, maxLength: 64 }),
  JWT_ALGORITHM: Type.Union([Type.Literal('HS256')], { default: 'HS256' }),
  JWT_EXPIRE: Type.String({ default: '24h' }),
});
type StaticEnv = Static<typeof EnvBESchema>;

const env = loadEnv<StaticEnv>(EnvBESchema);

export default env;
