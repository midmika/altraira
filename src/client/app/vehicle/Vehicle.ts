import type alt from 'alt-client';
import { AbstractVehicle } from '@shared/app/vehicle/AbstractVehicle';
import natives from 'natives';
import type { VirtualVehicle } from '@shared/app/vehicle/VirtualVehicle';

export class Vehicle extends AbstractVehicle<alt.Vehicle> {
    protected declare _instance: alt.Vehicle;

    constructor(virtualVehicle: VirtualVehicle, instance: alt.Vehicle) {
        super(virtualVehicle, instance);
    }

    get isDoorsOpen(): boolean {
        return natives.getVehicleDoorLockStatus(this._instance) === 0;
    }
}
