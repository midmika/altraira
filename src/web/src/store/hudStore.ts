import { defineStore } from 'pinia';
import type { Ref } from 'vue';
import { computed } from 'vue';
import { ref } from 'vue';

export interface IFHudState {
    time: string;
    dollars: number;
    speed: number | null;
    debug: {
        x: number;
        y: number;
        z: number;
        h: number;
    } | null;
    location: string | null;
}

export const useHudStore = defineStore('hud', () => {
    const state: Ref<IFHudState> = ref({
        time: '00:00',
        dollars: 0,
        speed: null,
        debug: null,
        location: null,
    });

    const dollars = computed(() => state.value.dollars);
    const time = computed(() => state.value.time);
    const speed = computed(() => state.value.speed);
    const debug = computed(() => state.value.debug);
    const location = computed(() => state.value.location);

    const update = (val: IFHudState) => {
        state.value = val;
    };

    return { state, dollars, speed, time, debug, location, update };
});
