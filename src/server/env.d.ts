declare global {
    namespace NodeJS {
        interface ProcessEnv {
            NODE_ENV: 'development' | 'production';
            // ALTAIRA_DEV_CLIENT_SKIP_AUTH?: 'true' | 'false'
            // ALTAIRA_DEV_OVERWRITE_SPAWN?: string;

            POSTGRES_HOST: string,
            POSTGRES_PORT: string,
            POSTGRES_USER: string,
            POSTGRES_PASS: string,

            LOKI_HOST: string;
            LOKI_PORT: string;
        }
    }
}