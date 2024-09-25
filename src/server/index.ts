import 'reflect-metadata';
import * as alt from 'alt-server';
import { init } from './init';
import {migrate} from "@/_magic/migrate";

const start = async () => {
    try {
        await migrate();
        await init();
    } catch (error) {
        console.log(error)
        // alt.stopServer()
    }
    // const db: Kysely<DB> = injector.get($repository._postgres);
    //
    // const _ = injector.get(WeaponService);
    // const itemFactory = injector.get(ItemFactory);
    // const source = _.initAllWeaponSources();
    // console.log(source);

    // const item: Weapon = itemFactory.createWeapon({ id: 0, quantity: 0, stockAmmo: 100, clipAmmo: 0 }, itemSources[0]);
    // console.log(item.clipAmmo, '/', item.stockAmmo);
    // item.reload();
    // item.shoot().shoot();
    // console.log(item.clipAmmo, '/', item.stockAmmo);
    // item.reload();
    // console.log(item.clipAmmo, '/', item.stockAmmo);
    //
    // const inventory = new Inventory();
    // inventory.add(item);
    // console.log(inventory.has(item));
    // inventory.remove(item);
    // console.log(inventory.has(item));

    // pos: { x: 264.98, y: -1000.85, z: 264.98 },
    // rot: { z: -0.07 },

    // const interior = await interiorService.create(intDto);
    // const house = await houseService.create({}, interior);

    // console.log(house.serializeForClient());
    // houseService.initializeList([house]);
};

void start();

alt.onClient('noclip:setPos', (player, x, y, z, vehicleId) => {
    if (vehicleId) {
        const target = alt.Vehicle.all[vehicleId - 1];
        if (target) {
            target.pos = new alt.Vector3(x, y, z);
        }
    }
    player.pos = new alt.Vector3(x, y, z);
});
