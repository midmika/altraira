import alt from 'alt-client';
import { inject, injectable } from 'inversify';
import { Frontend } from '@/app/builtin/Frontend';
import { EFaction } from '@shared/app/faction/Faction';
import type { ICharacterCustomization } from '@shared/app/character_customization/AbstractCharacterCustomization';
import { allowedCustomizationByFaction } from '@shared/app/character_customization/allowCustomizationByFaction';
import { CharacterCustomizationScript } from '@/app/character/CharacterCustomization.script';
import { EKeyCode } from '@/types/EKeyCode';
import { KeyResolver } from '@/app/builtin/KeyResolver';
import type { ICharacterDto } from '@shared/app/character/VirtualCharacter';
import { Server } from '@/app/builtin/Server';
import { waitBaseObject } from '@/utils/waitBaseObject';

@injectable()
export class CharacterCreationScript {
    private _ped: alt.LocalPed | null = null;

    private readonly _models = { male: 'mp_m_freemode_01', female: 'mp_f_freemode_01' };
    private _faction: EFaction = EFaction.alt;

    private _defaults: { [key in EFaction]: ICharacterCustomization } = {
        [EFaction.alt]: {
            model: 'mp_f_freemode_01',
            parents: {
                father: 21,
                mother: 34,
                skinMix: 0.39,
                faceMix: 1,
            },
            hairs: {
                index: allowedCustomizationByFaction[EFaction.alt].hairs.index[0],
                color1: allowedCustomizationByFaction[EFaction.alt].hairs.color1[0],
                color2: allowedCustomizationByFaction[EFaction.alt].hairs.color2[0],
            },
            facial: {
                eyeColor: allowedCustomizationByFaction[EFaction.alt].facial.eyeColor[0],
            },
        },
        [EFaction.skuf]: {
            model: 'mp_m_freemode_01',
            parents: {
                father: 0,
                mother: 0,
                skinMix: 0,
                faceMix: 0,
            },
            hairs: {
                index: allowedCustomizationByFaction[EFaction.skuf].hairs.index[0],
                color1: allowedCustomizationByFaction[EFaction.skuf].hairs.color1[0],
                color2: allowedCustomizationByFaction[EFaction.skuf].hairs.color2[0],
            },
            facial: {
                eyeColor: allowedCustomizationByFaction[EFaction.skuf].facial.eyeColor[0],
            },
        },
        [EFaction.ryodan]: {
            model: 'mp_m_freemode_01',
            parents: {
                father: 0,
                mother: 0,
                skinMix: 0,
                faceMix: 0,
            },
            hairs: {
                index: allowedCustomizationByFaction[EFaction.ryodan].hairs.index[0],
                color1: allowedCustomizationByFaction[EFaction.ryodan].hairs.color1[0],
                color2: allowedCustomizationByFaction[EFaction.ryodan].hairs.color2[0],
            },
            facial: {
                eyeColor: allowedCustomizationByFaction[EFaction.ryodan].facial.eyeColor[0],
            },
        },
    };

    private _custom: CharacterCustomizationScript;
    private _current: ICharacterCustomization = this._defaults[this._faction];

    private boundChangeFaction = this.changeFaction.bind(this);
    private boundUpdate = this.update.bind(this);

    constructor(
        @inject(Frontend) private readonly frontend: Frontend,
        @inject(KeyResolver) private readonly keyResolver: KeyResolver,
        @inject(Server) private readonly server: Server,
    ) {}

    async execute(): Promise<{ dto: ICharacterDto; cleanup: () => void } | null> {
        await this.changeFaction(EFaction.ryodan);
        return new Promise((resolve) => {
            const cleanup = (destroyPed: boolean = true) => {
                this.frontend.off('login:creation:select_faction', this.boundChangeFaction);
                this.frontend.off('login:creation:update_customization', this.boundUpdate);
                this.frontend.on('login:creation:create', onCreate);
                this.frontend.off('login:creation:cancel', onCancel);
                this.keyResolver.off(EKeyCode.ENTER, onCreate);
                this.keyResolver.off(EKeyCode.ESCAPE, onCancel);
                if (destroyPed && this._ped && this._ped.valid) this._ped?.destroy();
            };

            const onCreate = async (username: string) => {
                try {
                    const dto: ICharacterDto = await this.server.fetch(
                        'login:create',
                        username,
                        this._faction,
                        this._current,
                    );
                    cleanup(false);
                    resolve({
                        dto: dto,
                        cleanup: () => {
                            if (this._ped && this._ped.valid) this._ped?.destroy();
                        },
                    });
                } catch (error) {
                    this.frontend.emit('login:creation:nickname_error', error.message);
                }
            };

            const onCancel = () => {
                cleanup();
                resolve(null);
            };

            this.frontend.on('login:creation:select_faction', this.boundChangeFaction);
            this.frontend.on('login:creation:update_customization', this.boundUpdate);
            this.frontend.on('login:creation:create', onCreate);
            this.frontend.on('login:creation:cancel', onCancel);
            this.keyResolver.on(EKeyCode.ENTER, onCreate);
            this.keyResolver.on(EKeyCode.ESCAPE, onCancel);
        });
    }

    private async applyCurrent(): Promise<void> {
        const isCurrentMale = this._faction !== EFaction.alt;
        const isPedMale = this._ped?.model === alt.hash(this._models.male);
        if ((this._ped?.valid && isCurrentMale !== isPedMale) || !this._ped) {
            this._ped?.destroy();
            const ped = new alt.LocalPed(
                this._faction === EFaction.alt ? this._models.female : this._models.male,
                alt.Player.local.dimension,
                alt.Player.local.pos,
                alt.Player.local.rot,
            );
            await waitBaseObject(ped);
            this._ped = ped;
            this._custom = new CharacterCustomizationScript(null, ped);
        }

        this._custom.from(this._current).apply();
    }

    private async changeFaction(newFaction: EFaction): Promise<void> {
        this._faction = newFaction;
        this._current = this._defaults[newFaction];
        await this.applyCurrent();

        this.frontend.emit(
            'login:creation:available_customization',
            allowedCustomizationByFaction[this._faction],
            this._current,
        );
    }

    private async update(val: ICharacterCustomization): Promise<void> {
        this._current = val;
        await this.applyCurrent();
    }
}
