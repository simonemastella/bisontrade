import { Type, Static, TSchema } from '@sinclair/typebox';
import { AssertError, Value } from '@sinclair/typebox/value';

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
  JWT_ALGORITHM: Type.Union([Type.Literal('HS256')]).default('HS256'),
  JWT_EXPIRE: Type.String().default('24h'),
});
type StaticEnv = Static<typeof EnvBESchema>;

let env: StaticEnv;

try {
  // @ts-ignore
  env = Value.Parse(EnvBESchema, process.env);
} catch (error) {
  if (error instanceof AssertError) {
    const errors = Array.from(error.Errors())
      .filter((e) => e.type !== 45) // removing missing keys
      .map((e) => `\t${e.path}: received ${e.value} => ${e.message}`)
      .join('\n');
    throw new Error(`Invalid environment:\n${errors}`);
  }
  throw error;
}

export default env;
