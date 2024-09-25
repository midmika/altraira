import type { Character } from '@/app/character/Character';
import type alt from 'alt-server';
import { injectable } from 'inversify';

@injectable()
export class CharacterStorage {
    private readonly instanceToEntity: Map<alt.Player, Character> = new Map();
    private readonly idToInstance: Map<number, alt.Player> = new Map();

    add(entity: Character): void {
        this.instanceToEntity.set(entity.instance, entity);
        this.idToInstance.set(entity.id, entity.instance);
    }

    delete(entity: Character): void {
        this.instanceToEntity.delete(entity.instance);
        this.idToInstance.delete(entity.id);
    }

    getById(id: number): Character | null {
        const instance: alt.Player | undefined = this.idToInstance.get(id);
        if (!instance) return null;
        return this.getByInstance(instance);
    }

    getByInstance(instance: alt.Player): Character {
        return this.instanceToEntity.get(instance);
    }

    deleteByInstance(instance: alt.Player): void {
        this.instanceToEntity.delete(instance);
        this.idToInstance.delete(instance.$!.id);
    }
}
