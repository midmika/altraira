import type { ETrailerModel, EVehicleType } from './VirtualVehicle';
import { VirtualVehicle } from './VirtualVehicle';
import type { EVehicleOwnerType } from '../../types/core/vehicle';
import type { AbstractCharacter } from '../character/AbstractCharacter';
import type alt_server from 'alt-server';
import type alt_client from 'alt-client';
import type { Vector3 } from '../NativeEntity';

export abstract class AbstractVehicle<T extends alt_server.Vehicle | alt_client.Vehicle> extends VirtualVehicle {
    protected declare _instance: T;

    protected declare _modelName: Exclude<string, ETrailerModel>;
    protected declare _type: EVehicleType;
    protected declare _id: number;
    protected declare _ownerType: EVehicleOwnerType;
    protected declare _ownerCharacter: AbstractCharacter<alt_client.Player | alt_server.Player> | null;
    protected declare _ownerCharacterId: number | null;
    protected declare _primaryColor: number;
    protected declare _secondaryColor: number;
    protected declare _numberPlateText: string;
    protected declare _numberPlateIndex: number;

    protected _isDoorsLocked: boolean = true; /* Runtime Only */
    protected _isEngineOn: boolean = false; /* Runtime Only */

    protected _attachedTrailer: AbstractVehicle<T> | null = null;
    protected _attachedTruck: AbstractVehicle<T> | null = null;

    protected constructor(virtualVehicle: VirtualVehicle, instance: T) {
        super(virtualVehicle.serialize());
        this._instance = instance;
    }

    //#region Doors
    lockDoors(): void {
        this._isDoorsLocked = true;
    }

    unlockDoors(): void {
        this._isDoorsLocked = false;
    }
    //#endregion

    //#region Trailer
    isTrailerAttached(trailer?: AbstractVehicle<T>): boolean {
        if (trailer) return this._attachedTrailer === trailer;
        return !!this._attachedTrailer;
    }

    attachTrailer(trailer: AbstractVehicle<T>) {
        if (!this.isValid) throw new Error(`Trailer isn't valid`);
        if (this.isTruck) throw new Error(`Cannot attach trailer to [${this._type}] vehicle type`);
        if (this.isTrailerAttached()) throw new Error(`Trailer already attached`);
        this._attachedTrailer = trailer;
    }

    detachTrailer() {
        if (!this.isTrailerAttached()) throw new Error(`Trailer already detached`);
        this._attachedTrailer = null;
    }

    get attachedTrailer(): AbstractVehicle<T> | null {
        return this._attachedTrailer;
    }
    //#endregion

    //#region Truck
    isTruckAttached(truck?: AbstractVehicle<T>): boolean {
        if (truck) return this._attachedTruck === truck;
        return !!this._attachedTruck;
    }

    attachTruck(truck: AbstractVehicle<T>) {
        if (!this.isValid) throw new Error(`Cannot attach trailer to [${this._type}] vehicle type`);
        if (!this.isTruck) throw new Error(`Cannot attach trailer to [${this._type}] vehicle type`);
        if (this.isTrailerAttached()) throw new Error(`Truck already attached`);
        this._attachedTruck = truck;
    }

    detachTruck() {
        if (!this.isTrailerAttached()) throw new Error(`Truck isn't attached`);
        this._attachedTruck = null;
    }

    get attachedTruck(): AbstractVehicle<T> | null {
        return this._attachedTruck;
    }
    //#endregion

    //#region Color
    set primaryColor(color: number) {
        this._primaryColor = color;
    }

    set secondaryColor(color: number) {
        this._secondaryColor = color;
    }
    //#endregion

    //#region Number plate
    set numberPlateText(value: string) {
        this._numberPlateText = value;
    }

    set numberPlateIndex(value: number) {
        this._numberPlateIndex = value;
    }
    //#endregion

    //#region Common
    get instance(): T {
        return this._instance;
    }

    get pos(): Vector3 {
        return this._instance.pos;
    }

    set pos(pos: Vector3) {
        this._instance.pos = pos;
    }

    get rot(): Vector3 {
        return this._instance.rot;
    }

    set rot(rot: Vector3) {
        this._instance.rot = rot;
    }

    get isValid(): boolean {
        return this._instance.valid;
    }

    get instanceId(): number {
        return this._instance.id;
    }

    distanceTo(pos: Vector3): number {
        return this._instance.pos.distanceTo(pos);
    }
    //#endregion
}
