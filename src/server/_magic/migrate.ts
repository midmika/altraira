import {fileURLToPath} from "node:url";
import path from "node:path";
import {spawn} from "node:child_process";

export const migrate = async () => new Promise((res, rej) => {

    const baseDir = path.join(
        path.dirname(fileURLToPath(import.meta.url))
    );

    const scriptDir = path.join(baseDir, 'kysely', 'index', 'migrate.ts')

    const npmScript = spawn('npx', ['tsx', scriptDir, 'all'], { cwd: baseDir, stdio: 'inherit' });

    npmScript.on('close', (code) => {
        if(code === 0) {
            res(0)
        } else {
            rej(`Migrations failed with code: ${code}`)
        }
    });

    npmScript.on('message', (msg) => {
        console.log(msg);
    });

    npmScript.on('error', (err) => {
        console.error(`Произошла ошибка: ${err.message}`);
    });
})