import { Type, Static, TSchema } from '@sinclair/typebox';
import { AssertError, Value } from '@sinclair/typebox/value';

const EnvSchema = Type.Object({
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
type StaticEnv = Static<typeof EnvSchema>;

let env: StaticEnv;

try {
  env = Value.Parse(EnvSchema, process.env);
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
