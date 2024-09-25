import { injectable } from 'inversify';
import type alt from 'alt-client';

@injectable()
export class VehicleService {
    onVehicleStreamIn(vehicle: alt.Vehicle): void {
        console.log(vehicle.remoteID, 'created');
    }

    onVehicleStreamOut(vehicle: alt.Vehicle): void {
        console.log(vehicle.remoteID, 'destroyed');
    }
}
