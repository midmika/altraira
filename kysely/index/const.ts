import path from "node:path";
import dotenv from "dotenv"

if(process.env.NODE_ENV !== 'production') {
   dotenv.config({ path: path.join(import.meta.dirname, '..', '..', ".env") });
}

export const config = {
    host: process.env.POSTGRES_HOST,
    port: Number(process.env.POSTGRES_PORT),
    user: process.env.POSTGRES_USER,
    password: process.env.POSTGRES_PASS,
}

export const connectionString =
    `postgres://${config.user}:${config.password}@${config.host}:${config.port}/`

export const migrationsDir = path.join(
    import.meta.dirname,
    '..',
    'migrations',
);
