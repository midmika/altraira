import { AdminCommandController } from '@/controllers/AdminCommandController';
import { DebugController } from '@/controllers/DebugController';
import { LoginController } from '@/controllers/LoginController';

export const serverApiList = () => {
    return {
        login: LoginController,
        acommand: AdminCommandController,
        debug: DebugController,
    };
};
