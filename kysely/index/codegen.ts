import child_process from 'node:child_process';
import {connectionString} from "./const";

child_process.exec(
    'npx kysely-codegen',
    {
        env: { DATABASE_URL: connectionString },
    },
    (error, stdout, stderr) => {
        if (error) {
            console.log(error);
        } else if (stdout) {
            console.log(stdout);
        } else if (stderr) {
            console.log(stderr);
        }
    },
);
