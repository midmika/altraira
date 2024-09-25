<script setup lang="ts">
import { usePersonalVehicleStore } from '@/store/personalVehicleStore.ts';
import MenuVehicle from '@/hud/components/menu/MenuVehicle.vue';
import { computed, ComputedRef, ref, Ref } from 'vue';

const personalVehicleStore = usePersonalVehicleStore();

const cooldown: Ref<number> = ref(-1);
const isLoading: ComputedRef<boolean> = computed(() => cooldown.value > Date.now());

const delivery = (vehicle_id: number) => {
    if (isLoading.value) return;
    alt.emit('menu:delivery_truck', vehicle_id);
    cooldown.value = Date.now() + 1000;
};

const repair = (vehicle_id: number) => {
    if (isLoading.value) return;
    alt.emit('menu:repair_truck', vehicle_id);
    cooldown.value = Date.now() + 1000;
};
</script>

<template>
    <div class="cont scroll scroll-horizontal">
        <MenuVehicle
            v-if="Object.values(personalVehicleStore.list).length"
            v-for="i in 10"
            :vehicle="Object.values(personalVehicleStore.list)[0]"
            :key="i"
            :delivery="delivery"
            :repair="repair"
            :disabled="isLoading"
        />
    </div>
</template>

<style scoped lang="scss">
.cont {
    display: flex;
    flex-direction: row;
    gap: 12rem;
    max-width: 460rem;
}
</style>
