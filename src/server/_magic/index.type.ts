import type { Character as _Character } from '@/app/character/Character';
import type { IAnyColshape } from '@shared/app/colshape/Colshape';

declare module 'alt-server' {
    // export interface Vehicle {
    //     $?: _Vehicle;
    // }
    export interface Player {
        $: _Character;
    }
    export interface Colshape {
        $: IAnyColshape;
    }
}
