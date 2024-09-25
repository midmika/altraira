import { defineStore } from 'pinia';
import type { Ref } from 'vue';
import { computed } from 'vue';
import { ref } from 'vue';
import type { IVehicleDto } from '@/shared/app/vehicle/VirtualVehicle.ts';

export interface IFPersonalVehicleStore {
    list: Record<number, IVehicleDto>;
}

export const usePersonalVehicleStore = defineStore('personal_vehicle', () => {
    const state: Ref<IFPersonalVehicleStore> = ref({
        list: {},
    });

    const update = (dto: IFPersonalVehicleStore) => {
        state.value = dto;
    };

    const list = computed(() => state.value.list);

    return { state, list, update };
});
