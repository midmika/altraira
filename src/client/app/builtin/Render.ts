import type { IAnyFunction } from '@shared/types';
import * as alt from 'alt-client';
import { injectable } from 'inversify';
import natives from 'natives';

@injectable()
export class Render {
    private _isCursorShown: boolean = false;
    private readonly list: Set<IAnyFunction> = new Set();

    constructor() {
        alt.everyTick(this.onRender.bind(this));
    }

    get cursorState(): boolean {
        return this._isCursorShown;
    }

    set cursorState(val: boolean) {
        this._isCursorShown = val;
        alt.showCursor(val);
    }

    private onRender(): void {
        for (const [cb] of this.list.entries()) {
            cb();
        }
        natives.hideHudComponentThisFrame(6); // car name
        natives.hideHudComponentThisFrame(7); // car class
        natives.hideHudComponentThisFrame(8); // area name
        natives.hideHudComponentThisFrame(9); // street name

        //#region ambient sound
        natives.startAudioScene('DLC_MPHEIST_TRANSITION_TO_APT_FADE_IN_RADIO_SCENE');
        natives.setStaticEmitterEnabled('LOS_SANTOS_VANILLA_UNICORN_01_STAGE', false);
        natives.setStaticEmitterEnabled('LOS_SANTOS_VANILLA_UNICORN_02_MAIN_ROOM', false);
        natives.setStaticEmitterEnabled('LOS_SANTOS_VANILLA_UNICORN_03_BACK_ROOM', false);
        natives.setAmbientZoneListStatePersistent('AZL_DLC_Hei4_Island_Disabled_Zones', false, true);
        natives.setAmbientZoneListStatePersistent('AZL_DLC_Hei4_Island_Zones', true, true);
        natives.setScenarioTypeEnabled('WORLD_VEHICLE_STREETRACE', false);
        natives.setScenarioTypeEnabled('WORLD_VEHICLE_SALTON_DIRT_BIKE', false);
        natives.setScenarioTypeEnabled('WORLD_VEHICLE_SALTON', false);
        natives.setScenarioTypeEnabled('WORLD_VEHICLE_POLICE_NEXT_TO_CAR', false);
        natives.setScenarioTypeEnabled('WORLD_VEHICLE_POLICE_CAR', false);
        natives.setScenarioTypeEnabled('WORLD_VEHICLE_POLICE_BIKE', false);
        natives.setScenarioTypeEnabled('WORLD_VEHICLE_MILITARY_PLANES_SMALL', false);
        natives.setScenarioTypeEnabled('WORLD_VEHICLE_MILITARY_PLANES_BIG', false);
        natives.setScenarioTypeEnabled('WORLD_VEHICLE_MECHANIC', false);
        natives.setScenarioTypeEnabled('WORLD_VEHICLE_EMPTY', false);
        natives.setScenarioTypeEnabled('WORLD_VEHICLE_BUSINESSMEN', false);
        natives.setScenarioTypeEnabled('WORLD_VEHICLE_BIKE_OFF_ROAD_RACE', false);
        natives.startAudioScene('FBI_HEIST_H5_MUTE_AMBIENCE_SCENE');
        natives.startAudioScene('CHARACTER_CHANGE_IN_SKY_SCENE');
        natives.setAudioFlag('PoliceScannerDisabled', true);
        natives.setAudioFlag('DisableFlightMusic', true);
        // natives.setPlayerCanUseCover(PlayerId(),false)
        natives.setRandomEventFlag(false);
        natives.setDeepOceanScaler(0.0);
        //#endregion

        natives.setPedConfigFlag(alt.Player.local, 35, false);
    }

    public add(cb: IAnyFunction): void {
        this.list.add(cb);
    }

    public delete(cb: IAnyFunction): void {
        this.list.delete(cb);
    }
}
