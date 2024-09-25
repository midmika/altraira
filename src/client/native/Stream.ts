import { inject, injectable } from 'inversify';
import alt from 'alt-client';
import { BaseObjectType } from 'alt-shared';
import { StreamCharacterService } from '@/app/character/StreamCharacter.service';

@injectable()
export class Stream {
    private bound_gameEntityCreate = this.gameEntityCreate.bind(this);
    private bound_gameEntityDestroy = this.gameEntityDestroy.bind(this);
    private bound_syncedMetaChange = this.syncedMetaChange.bind(this);

    @inject(StreamCharacterService)
    private readonly streamCharacterService: StreamCharacterService;

    constructor() {}

    start(): void {
        alt.on('gameEntityCreate', this.bound_gameEntityCreate);
        alt.on('gameEntityDestroy', this.bound_gameEntityDestroy);
        alt.on('syncedMetaChange', this.bound_syncedMetaChange);
    }

    private gameEntityCreate(entity: alt.Entity): void {
        if (entity.type === BaseObjectType.Player) {
            this.streamCharacterService.addPlayer(entity as alt.Player);
        }
    }
    private gameEntityDestroy(entity: alt.Entity): void {
        if (entity.type === BaseObjectType.Player) {
            this.streamCharacterService.removePlayer(entity as alt.Player);
        }
    }

    private syncedMetaChange(entity: alt.Entity, key: string, value: any, oldValue: any): void {
        if (entity.type === BaseObjectType.Player) {
            this.streamCharacterService.updated(entity as alt.Player, key, value, oldValue);
        }
    }
}
