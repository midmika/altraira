import * as alt from 'alt-server';
import { inject, injectable } from 'inversify';

@injectable()
export class NativeVehicleController {
    private readonly boundOnVehicleAttach = this.onVehicleAttach.bind(this);
    private readonly boundOnVehicleDetach = this.onVehicleDetach.bind(this);
    private readonly boundOnVehicleDamage = this.onVehicleDamage.bind(this);
    private readonly boundOnVehicleDestroy = this.onVehicleDestroy.bind(this);
    private readonly boundOnVehicleHorn = this.onVehicleHorn.bind(this);
    private readonly boundOnVehicleSiren = this.onVehicleSiren.bind(this);

    start(): void {
        alt.on('vehicleAttach', this.boundOnVehicleAttach);
        alt.on('vehicleDetach', this.boundOnVehicleDetach);
        alt.on('vehicleDamage', this.boundOnVehicleDamage);
        alt.on('vehicleDestroy', this.boundOnVehicleDestroy);
        alt.on('vehicleHorn', this.boundOnVehicleHorn);
        alt.on('vehicleSiren', this.boundOnVehicleSiren);
    }

    stop(): void {
        alt.off('vehicleAttach', this.boundOnVehicleAttach);
        alt.off('vehicleDetach', this.boundOnVehicleDetach);
        alt.off('vehicleDamage', this.boundOnVehicleDamage);
        alt.off('vehicleDestroy', this.boundOnVehicleDestroy);
        alt.off('vehicleHorn', this.boundOnVehicleHorn);
        alt.off('vehicleSiren', this.boundOnVehicleSiren);
    }

    private onVehicleAttach(trailer: alt.Vehicle, truck: alt.Vehicle): void {
        // const $1: Vehicle | void = truck.$;
        // const $2: Trailer | void = trailer.$trailer;
        //
        // if (!$1 || !$2) return;
        // if ($1.isTruck && $2) {
        //     // $1.setTrailer($2);
        //     // $2.setTruck($1);
        //     console.log(`Trailer ${$2.id} attached to truck ${$1.id} `);
        // }
    }

    private onVehicleDetach(trailer: alt.Vehicle, truck: alt.Vehicle): void {
        // const $1: Vehicle | void = truck.$;
        // const $2: Trailer | void = trailer.$trailer;
        //
        // if (!$1 || !$2) return;
        // // $1.detachTrailer();
        // // $2.detachTruck();
        // console.log(`trailer ${$2.id} detached from truck ${$1.id} `);
    }

    private onVehicleDamage(
        vehicle: alt.Vehicle,
        attacker: alt.Entity | null,
        bodyHealthDamage: number,
        additionalBodyHealthDamage: number,
        engineHealthDamage: number,
        petrolTankDamage: number,
        weapon: number,
    ): void {}

    private onVehicleDestroy(vehicle: alt.Vehicle): void {
        // const candidate: Vehicle | Trailer | null = vehicle.$trailer ?? vehicle.$ ?? null;
        //
        // if (candidate === null) {
        //     alt.log(`onVehicleDestroy miss understood, id ${vehicle.id}`);
        //     return;
        // }
        //
        // this.vehicleService.onDestroy(candidate);
    }

    private onVehicleHorn(vehicle: alt.Vehicle, player: alt.Player, state: boolean): void {}
    private onVehicleSiren(vehicle: alt.Vehicle, state: boolean): void {}
}
