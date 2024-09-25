import { inject, injectable } from 'inversify';
import { NativePlayerController } from '@/native/NativePlayerController';
import { NativeVehicleController } from '@/native/NativeVehicleController';
import { ZoneScript } from '@/app/zone/Zone.script';
import { ColshapeScript } from '@/app/colshape/Colshape.script';
import { SpawnScript } from '@/app/spawn/Spawn.script';
import { DevScript } from '@/app/dev/Dev.script';
import { Logger } from '@/app/logger/Logger.service';

@injectable()
export class RootService {
    @inject(NativePlayerController) private readonly nativePlayerEventService!: NativePlayerController;
    @inject(NativeVehicleController) private readonly nativeVehicleEventController!: NativeVehicleController;
    @inject(SpawnScript) private readonly spawnScript!: SpawnScript;
    @inject(ZoneScript) private readonly zoneScript!: ZoneScript;
    @inject(ColshapeScript) private readonly colshapeScript!: ColshapeScript;

    @inject(DevScript) private readonly devScript!: DevScript;
    @inject(Logger) private readonly logger!: Logger;

    start(): void {
        this.zoneScript.start();
        this.spawnScript.start();
        this.colshapeScript.start();

        this.nativePlayerEventService.start();
        this.nativeVehicleEventController.start();

        this.logger.info();

        if (process.env.ALTAIRA_MODE === 'dev') this.devScript.start();
    }
}
