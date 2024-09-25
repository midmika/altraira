import type { IInitialClientData } from '../types';
import type { IVehicleColor } from '../app/vehicle/AbstractVehicle';

export type IServerApiRoot = {
    start: IServerApiStart;
    acommand: IServerApiAdminCommand;
};

export type IServerApiStart = {
    hello(message: string): Promise<string>;
    world(data: string): void;
    getInitialData(): Promise<IInitialClientData>;
};

export type IServerApiAdminCommand = {
    veh(model: string, primaryColor?: IVehicleColor, secondaryColor?: IVehicleColor): Promise<void>;
};
