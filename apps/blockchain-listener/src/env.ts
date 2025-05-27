import { Type, Static } from '@sinclair/typebox';
import { loadEnv } from '@bisontrade/libs';

const EnvBLSchema = Type.Object({
  blockchain: Type.Union([Type.Literal('vechain'), Type.Literal('base')]),
  environment: Type.Union([Type.Literal('testnet'), Type.Literal('mainnet')]),
  bgv1Address: Type.String({
    pattern: '^0x[a-fA-F0-9]{40}$',
    description: 'Ethereum compliant address',
  }),
  POSTGRES_PORT: Type.Number({ minimum: 1, maximum: 65535 }),
  POSTGRES_HOST: Type.String(),
  POSTGRES_USER: Type.String(),
  POSTGRES_PASSWORD: Type.String(),
  POSTGRES_DB: Type.String(),
});
type StaticEnv = Static<typeof EnvBLSchema>;

const env = loadEnv<StaticEnv>(EnvBLSchema);

export default env;
