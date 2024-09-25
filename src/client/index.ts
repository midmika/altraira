import 'reflect-metadata';
import * as alt from 'alt-client';
import './handle';

import { inversifyAfterWork, inversifyInitialWork } from '@/_magic/invesify.init';
import injector from '@/_magic/inversify.config';
import { LoginScript } from '@/app/login/LoginScript';
import { sleep } from '@/utils/sleep';
import { Character } from '@/app/character/Character';
import { VirtualCharacter } from '@shared/app/character/VirtualCharacter';
import { Frontend } from '@/app/builtin/Frontend';
import { RootService } from '@/app/Root.service';
import { registerControllers } from '@/_magic/registerControllers';

alt.log('config:', globalThis.config)

const loadMainCEF = async () => {
    const frontend: Frontend = injector.get(Frontend);
    await frontend.connect();
    //
    alt.log('Frontend Ready');
};

const index = async () => {
    inversifyInitialWork();
    await loadMainCEF();

    await sleep(100);
    const charDto = await injector.get(LoginScript).start();

    // Wait server model sync
    while (alt.Player.local.model !== alt.hash(charDto.customization.model)) await sleep(1);
    const localCharacter: Character = new Character(new VirtualCharacter(charDto), alt.Player.local);
    inversifyAfterWork({ localCharacter });

    await injector.get(RootService).initialize();
    registerControllers();
};

index()