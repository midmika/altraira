import type { IClientApi } from '@shared/api';
import { GlobalController } from '@/controllers/GlobalController';
import { SelfController } from '@/controllers/SelfController';

export const clientApiList = (): any => {
    return {
        start: GlobalController,
        self: SelfController,
    };
};
