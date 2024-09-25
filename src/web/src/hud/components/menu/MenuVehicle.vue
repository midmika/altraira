<script setup lang="ts">
import { IVehicleDto } from '@/shared/app/vehicle/VirtualVehicle.ts';

interface IProps {
    vehicle: IVehicleDto;
    delivery: (id: number) => void;
    repair: (id: number) => void;
    disabled: boolean;
}

const { vehicle, delivery, repair, disabled } = defineProps<IProps>();
</script>

<template>
    <div class="truck">
        <div class="truck-head">
            <span>{{ vehicle.modelName }}</span>
            <span>#{{ vehicle.id }}</span>
        </div>
        <div class="truck-buttons">
            <button @click="delivery(vehicle.id)" :disabled="disabled">Доставить</button>
            <button @click="repair(vehicle.id)" :disabled="disabled">Починить</button>
        </div>
    </div>
</template>

<style scoped lang="scss">
.truck {
    display: flex;
    flex-direction: column;
    padding: 8rem;
    width: fit-content;
    border: 1px solid white;
    gap: 18rem;

    justify-content: space-between;

    &-head {
        display: flex;
        justify-content: space-between;
        gap: 24rem;
    }

    &-buttons {
        display: flex;
        flex-direction: column;
        gap: 8rem;
    }
}
</style>
