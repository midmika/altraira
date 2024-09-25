import alt from 'alt-client';
import { inject, injectable } from 'inversify';
import { Frontend } from '@/app/builtin/Frontend';
import { CharacterCustomizationScript } from '@/app/character/CharacterCustomization.script';
import type { ICharacterDto } from '@shared/app/character/VirtualCharacter';
import { waitBaseObject } from '@/utils/waitBaseObject';

@injectable()
export class CharacterSelectionScript {
    private _ped: alt.LocalPed | null = null;

    constructor(@inject(Frontend) private readonly frontend: Frontend) {}

    async execute(list: ICharacterDto[]): Promise<null | { dto: ICharacterDto; cleanup: () => void }> {
        return new Promise((resolve) => {
            this.frontend.emit('login:select:start', list);

            if (list.length) this.set(list[0]);

            const cleanup = (destroyPed: boolean = true) => {
                this.frontend.off('login:select:select', onSelect);
                this.frontend.off('login:select:preview', onPreview);
                this.frontend.off('login:select:create', onCreate);
                if (destroyPed && this._ped && this._ped.valid) this._ped?.destroy();
            };

            const onSelect = (dto: ICharacterDto) => {
                cleanup(false);
                resolve({
                    dto: dto,
                    cleanup: () => {
                        if (this._ped && this._ped.valid) this._ped?.destroy();
                    },
                });
            };

            const onCreate = () => {
                cleanup();
                resolve(null);
            };

            const onPreview = (dto: ICharacterDto) => {
                this.set(dto);
            };

            this.frontend.on('login:select:select', onSelect);
            this.frontend.on('login:select:preview', onPreview);
            this.frontend.on('login:select:create', onCreate);
        });
    }

    private async set(dto: ICharacterDto): Promise<void> {
        if (this._ped && this._ped.valid) this._ped.destroy();
        const ped = new alt.LocalPed(
            dto.customization.model,
            alt.Player.local.dimension,
            alt.Player.local.pos,
            alt.Player.local.rot,
        );
        await waitBaseObject(ped);
        this._ped = ped;
        const customization = new CharacterCustomizationScript(dto.customization, ped);
        customization.apply();
    }
}
