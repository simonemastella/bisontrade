declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'local';

    POSTGRES_HOST: string;
    POSTGRES_PORT: string;
    POSTGRES_USER: string;
    POSTGRES_PASSWORD: string;
    POSTGRES_DB: string;
  }
}
