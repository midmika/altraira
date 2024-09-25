import alt from 'alt-client';
import natives from 'natives';
import type { IAnyFunction } from '@shared/types';
import { EKeyCode } from '@/types/EKeyCode';
import { Frontend } from '@/app/builtin/Frontend';
import { KeyResolver } from '@/app/builtin/KeyResolver';
import { Server } from '@/app/builtin/Server';
import { Render } from '@/app/builtin/Render';
import { inject, injectable } from 'inversify';
import { PolygonCreator } from '@/app/polygon_creator/PolygonCreator';
import { DebugScript } from '@/app/debug/Debug.script';
import { ZoneEditorScript } from '@/app/zone/ZoneEditor.script';

@injectable()
export class AdminConsoleScript {
    @inject(Frontend) private readonly frontend: Frontend;
    @inject(KeyResolver) private readonly keyResolver: KeyResolver;
    @inject(Render) private readonly render: Render;
    @inject(Server) private readonly server: Server;
    @inject(PolygonCreator) private readonly polygonCreator: PolygonCreator;
    @inject(DebugScript) private readonly debugScript: DebugScript;
    @inject(ZoneEditorScript) private readonly zoneEditorScript: ZoneEditorScript;

    private isOpen: boolean = false;
    private readonly boundDisableControlActions: IAnyFunction = this.disableControlActions.bind(this);
    private readonly boundOnCommand: IAnyFunction = this.onCommand.bind(this);

    start(): void {
        this.frontend.on('command', this.boundOnCommand);
        this.keyResolver.on(EKeyCode.F2, this.onTrigger.bind(this), 'admin_console');
    }

    private async onCommand(fullText: string): Promise<void> {
        this.onExit();

        const _args = fullText.split(' ');
        const command: string = _args[0];
        const args: string[] = _args.slice(1);

        switch (command) {
            case 'veh': {
                await this.onVeh(args[0], parseFloat(args[1]), parseFloat(args[2]));
                break;
            }
            case 'money': {
                await this.onMoney(parseInt(args[0]));
                break;
            }
            case 'tp': {
                await this.onTp(parseFloat(args[0]), parseFloat(args[1]), parseFloat(args[2]));
                break;
            }
            case 'pg': {
                this.polygonCreator.toggle();
                break;
            }
            case 'zeditor': {
                this.zoneEditorScript.toggle();
                break;
            }
            case 'debug': {
                this.debugScript.toggle();
                break;
            }
        }
    }

    private async onVeh(model: string, fc: number, sc: number): Promise<void> {
        this.server.call('acommand:veh', model, fc, sc);
    }

    private async onMoney(value: number): Promise<void> {
        this.server.call('acommand:money', value);
    }

    private async onDetachTrailer(): Promise<void> {
        this.server.call('acommand:detach_trailer');
    }

    private async onAttachTrailer(trailerRemoteId: number): Promise<void> {
        this.server.call('acommand:attach_trailer', trailerRemoteId);
    }

    private async onTp(x: number, y: number, z: number): Promise<void> {
        alt.Player.local.pos = new alt.Vector3(x, y, z);
    }

    private onTrigger(): void {
        this.isOpen ? this.onExit() : this.onEnter();
    }

    private onDebug(): void {}

    private disableControlActions(): void {
        natives.disableAllControlActions(0);
        natives.disableAllControlActions(1);
        natives.disableAllControlActions(2);
        natives.disableControlAction(32, 200, true);
    }

    private onEnter(): void {
        this.isOpen = true;
        this.render.add(this.boundDisableControlActions);
        this.frontend.focus();
        this.frontend.emit('console:open');
        this.keyResolver.reserveInputGroup('admin_console');
    }

    private onExit(): void {
        this.isOpen = false;
        this.render.delete(this.boundDisableControlActions);
        this.frontend.blur();
        this.frontend.emit('console:close');
        this.keyResolver.freeInputGroup('admin_console');
    }
}
