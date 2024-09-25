import type { IAnyColshape } from '@shared/app/colshape/Colshape';

declare module 'alt-client' {
    export interface Colshape {
        $: IAnyColshape;
    }
}
