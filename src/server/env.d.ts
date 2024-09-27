declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            DEV_RECONNECT_IP_LIST?: string;

            POSTGRES_HOST: string,
            POSTGRES_PORT: string,
            POSTGRES_USER: string,
            POSTGRES_PASS: string,

            LOKI_HOST: string;
            LOKI_PORT: string;
        }
    }
}