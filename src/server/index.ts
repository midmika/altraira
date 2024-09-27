import 'reflect-metadata';
import * as alt from 'alt-server';
import { init } from './init';
import {migrate} from "@/_magic/migrate";

;
(async () => {
    try {
        if(process.env.NODE_ENV === 'production') await migrate();
        await init();
    } catch (e) {
        console.error(e);
        alt.stopServer()
    }
})();

alt.onClient('noclip:setPos', (player, x, y, z, vehicleId) => {
    if (vehicleId) {
        const target = alt.Vehicle.all[vehicleId - 1];
        if (target) {
            target.pos = new alt.Vector3(x, y, z);
        }
    }
    player.pos = new alt.Vector3(x, y, z);
});
