import { useHudStore } from '@/store/hudStore.ts';
import type { IFrontendStoreType } from '@client/app/builtin/Frontend.ts';
import { usePersonalVehicleStore } from '@/store/personalVehicleStore.ts';

export const initClientEmitter = () => {
    const hudStore = useHudStore();
    const personalVehicleStore = usePersonalVehicleStore();

    alt.on('__store__', (type: IFrontendStoreType, value: any) => {
        switch (type) {
            case 'hud': {
                hudStore.update(value);
                break;
            }
            case 'personal_vehicle': {
                personalVehicleStore.update(value);
                break;
            }
        }
    });
};
