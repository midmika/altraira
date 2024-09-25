import alt from 'alt-client';
import native from 'natives';
import { KeyResolver } from '@/app/builtin/KeyResolver';
import { inject, injectable } from 'inversify';
import { EKeyCode } from '@/types/EKeyCode';

@injectable()
export class NoClipScript {
    private enabled: boolean = false;
    private speed: number = 3.0;
    private tickId: number = -1;
    private vehicle: alt.Vehicle | null = null;

    private boundToggle = this.toggle.bind(this);

    KEYS = {
        FORWARD: 32,
        BACKWARD: 33,
        LEFT: 34,
        RIGHT: 35,
        UP: 22,
        DOWN: 36,
        SHIFT: 21,
    };

    constructor(@inject(KeyResolver) private readonly keyResolver: KeyResolver) {}

    start(): void {
        alt.log('Clip Script started');
        this.keyResolver.on(EKeyCode.NUMPAD_0, this.boundToggle);
    }

    private toggle(): void {
        if (this.enabled) {
            this.disable();
        } else {
            this.enable();
        }
    }

    private enable() {
        if (this.enabled) return;
        this.enabled = true;
        if (alt.Player.local.vehicle) {
            this.vehicle = alt.Player.local.vehicle;
            native.taskLeaveVehicle(alt.Player.local.scriptID, this.vehicle, 16);
            native.freezeEntityPosition(this.vehicle, true);
        }
        native.clearPedTasksImmediately(alt.Player.local);
        native.freezeEntityPosition(alt.Player.local.scriptID, true);

        this.tickId = alt.everyTick(this.keyHandler.bind(this));
    }

    private disable() {
        if (!this.enabled) return;
        this.enabled = false;
        if (this.vehicle && this.vehicle.valid) {
            native.freezeEntityPosition(this.vehicle.scriptID, false);
            native.taskEnterVehicle(alt.Player.local.scriptID, this.vehicle!.scriptID, -1, -1, 0, 16, '', 0);
        }

        native.freezeEntityPosition(alt.Player.local.scriptID, false);

        this.vehicle = null;
        alt.clearEveryTick(this.tickId);
    }

    keyHandler() {
        if (!native.isControlEnabled(0, 0)) return;

        let currentPos = alt.Player.local.pos;
        let speed = this.speed;
        const rot = native.getGameplayCamRot(2);
        const dirForward = camVectorForward(rot);
        const dirRight = camVectorRight(rot);

        if (native.isDisabledControlPressed(0, this.KEYS.SHIFT)) speed = speed * 5;

        if (native.isDisabledControlPressed(0, this.KEYS.FORWARD))
            currentPos = addSpeedToVector(currentPos, dirForward, speed);
        if (native.isDisabledControlPressed(0, this.KEYS.BACKWARD))
            currentPos = addSpeedToVector(currentPos, dirForward, -speed);
        if (native.isDisabledControlPressed(0, this.KEYS.LEFT))
            currentPos = addSpeedToVector(currentPos, dirRight, -speed, true);
        if (native.isDisabledControlPressed(0, this.KEYS.RIGHT))
            currentPos = addSpeedToVector(currentPos, dirRight, speed, true);
        let zModifier = 0;
        if (native.isDisabledControlPressed(0, this.KEYS.UP)) zModifier += speed;
        if (native.isDisabledControlPressed(0, this.KEYS.DOWN)) zModifier -= speed;

        if (
            !isVectorEqual(new alt.Vector3(currentPos.x, currentPos.y, currentPos.z + zModifier), alt.Player.local.pos)
        ) {
            alt.emitServer(
                'noclip:setPos',
                currentPos.x,
                currentPos.y,
                currentPos.z + zModifier,
                this?.vehicle?.remoteID ?? -1,
            );
        }
    }
}

function addSpeedToVector(vector1, vector2, speed, lr = false) {
    return new alt.Vector3(
        vector1.x + vector2.x * speed,
        vector1.y + vector2.y * speed,
        lr ? vector1.z : vector1.z + vector2.z * speed,
    );
}

function camVectorForward(camRot) {
    const rotInRad = {
        x: camRot.x * (Math.PI / 180),
        y: camRot.y * (Math.PI / 180),
        z: camRot.z * (Math.PI / 180) + Math.PI / 2,
    };

    const camDir = {
        x: Math.cos(rotInRad.z),
        y: Math.sin(rotInRad.z),
        z: Math.sin(rotInRad.x),
    };

    return camDir;
}

function camVectorRight(camRot) {
    const rotInRad = {
        x: camRot.x * (Math.PI / 180),
        y: camRot.y * (Math.PI / 180),
        z: camRot.z * (Math.PI / 180),
    };

    const camDir = {
        x: Math.cos(rotInRad.z),
        y: Math.sin(rotInRad.z),
        z: Math.sin(rotInRad.x),
    };

    return camDir;
}

function isVectorEqual(vector1, vector2) {
    return vector1.x === vector2.x && vector1.y === vector2.y && vector1.z === vector2.z;
}
