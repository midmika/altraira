import type { Character } from '@/app/character/Character';
import type { Vehicle } from '@/app/vehicle/Vehicle';

export type IAnyEntity = Character | Vehicle;

export interface IConfig {
    MODE: 'development' | 'production'
}

export {};
