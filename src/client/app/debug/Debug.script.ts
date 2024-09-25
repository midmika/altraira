import { inject, injectable } from 'inversify';
import { ZoneScript } from '@/app/zone/Zone.script';
import alt from 'alt-client';
import { SpawnScript } from '@/app/spawn/Spawn.script';

@injectable()
export class DebugScript {
    @inject(ZoneScript)
    private readonly zoneScript: ZoneScript;
    @inject(SpawnScript)
    private readonly spawnScript: SpawnScript;

    private _isActivated: boolean = false;
    private _tickTimer: number = -1;

    start(): void {}

    toggle(): void {
        if (this._isActivated) {
            this.deactivate();
        } else {
            this.activate();
        }
    }

    private activate(): void {
        this._tickTimer = alt.everyTick(() => {
            this.zoneScript.list.forEach((i) => i.debugThisFrame());
            this.spawnScript.list.forEach((i) => i.debugThisFrame());
        });
        this._isActivated = true;
    }

    private deactivate(): void {
        alt.clearEveryTick(this._tickTimer);
        this._isActivated = false;
    }
}
