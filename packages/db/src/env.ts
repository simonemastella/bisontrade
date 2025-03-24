import { Type, Static } from '@sinclair/typebox';
import { loadEnv } from '@bisontrade/libs';

const EnvDBSchema = Type.Object({
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
});

type StaticEnv = Static<typeof EnvDBSchema>;

const env = loadEnv<StaticEnv>(EnvDBSchema);

export default env;
