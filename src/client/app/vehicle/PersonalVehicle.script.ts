import { inject, injectable } from 'inversify';
import type { IVehicleDto } from '@shared/app/vehicle/VirtualVehicle';
import { VirtualVehicle } from '@shared/app/vehicle/VirtualVehicle';
import { Frontend } from '@/app/builtin/Frontend';
import type { IFPersonalVehicleStore } from '@webstore/personalVehicleStore';

@injectable()
export class PersonalVehicleScript {
    private readonly _list: VirtualVehicle[] = [];

    constructor(@inject(Frontend) private readonly frontend: Frontend) {}

    init(list: IVehicleDto[]): void {
        this._list.push(...list.map((dto) => new VirtualVehicle(dto)));
        this.frontend.setStore<IFPersonalVehicleStore>('personal_vehicle', { list: this.serialize() });
    }

    get list(): VirtualVehicle[] {
        return this._list;
    }

    private serialize(): IVehicleDto[] {
        return this._list.map((v) => v.serialize());
    }

    getById(id: number): VirtualVehicle | null {
        return this._list.find((v) => v.id === id) ?? null;
    }
}
