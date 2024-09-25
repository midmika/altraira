import alt from 'alt-client';
import type { IEventLoggerLog } from '@shared/app/C_eventLogger';
import { Frontend } from '@/app/builtin/Frontend';
import { inject, injectable } from 'inversify';
import { KeyResolver } from '@/app/builtin/KeyResolver';
import { EKeyCode } from '@/types/EKeyCode';
import { Render } from '@/app/builtin/Render';
import natives from 'natives';

@injectable()
export class EventLogger {
    private IdIncrement: number = 0;
    private isOpen: boolean = false;

    private readonly boundOnRender: () => void;

    constructor(
        @inject(Frontend) private readonly frontend: Frontend,
        @inject(KeyResolver) private readonly keyResolver: KeyResolver,
        @inject(Render) private readonly render: Render,
    ) {
        this.boundOnRender = () => natives.disableAllControlActions(0);
        this.keyResolver.on(EKeyCode.F3, this.toggleOpenState.bind(this), 'eventlogger');
    }

    private toggleOpenState(): void {
        this.isOpen = !this.isOpen;

        if (this.isOpen) {
            alt.showCursor(true);
            this.frontend.focus();
            this.render.add(this.boundOnRender);
            this.keyResolver.reserveInputGroup('eventlogger');
        } else {
            alt.showCursor(false);
            this.frontend.blur();
            this.render.delete(this.boundOnRender);
            this.keyResolver.freeInputGroup('eventlogger');
        }

        this.frontend.emit('Volos:ToggleOpen', this.isOpen);
    }

    emit(log: Omit<IEventLoggerLog, 'id' | 'start_time' | 'end_time'>): number {
        this.IdIncrement += 1;
        const id: number = this.IdIncrement;
        const object: IEventLoggerLog = { ...log, start_time: Date.now(), id };
        this.frontend.emit('Volos:Add', object);
        return id;
    }

    update(id: number, log: Partial<Omit<IEventLoggerLog, 'id' | 'end_time'>>): void {
        const object: Partial<IEventLoggerLog> = { ...log, id };
        if (log.status !== 'failed') object.end_time = Date.now();
        this.frontend.emit('Volos:Update', object);
    }
}
