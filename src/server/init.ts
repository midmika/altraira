import inversifyInit from '@/_magic/invesify.init';
import { registerControllers } from '@/_magic/registerControllers';
import injector from '@/_magic/inversify.config';
import { RootService } from '@/app/Root.service';

export const init = async () => {
    await inversifyInit();
    registerControllers();
    injector.get(RootService).start();
};
