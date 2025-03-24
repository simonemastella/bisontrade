import { TObject } from '@sinclair/typebox';
import { AssertError, Value } from '@sinclair/typebox/value';

export const loadEnv = <T>(Schema: TObject<any>): T => {
  let locEnv;
  try {
    // @ts-ignore
    locEnv = Value.Parse(Schema, process.env);
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
  return locEnv;
};
