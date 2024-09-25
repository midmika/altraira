<script setup lang="ts">
import { useHudStore } from '@/store/hudStore.ts';
const hudStore = useHudStore();
</script>

<template>
    <div class="cont">
        <div class="bot">
            <span class="time">{{ hudStore.time }}</span>
            <div class="speed" v-if="typeof hudStore.speed === 'number'">
                <span class="speed__value"> {{ hudStore.speed.toFixed(0) }} </span>
                <span class="speed__text">km/h</span>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.cont {
    margin-top: auto;
    width: 100%;
    overflow: hidden;
}
.bot {
    display: flex;
    justify-content: space-between;
    align-items: end;
}
.time {
    font-size: 20rem;
    width: fit-content;
    font-family: 'Anonymous Pro', monospace;
    font-weight: 700;
}
.speed {
    display: flex;
    align-items: end;
    gap: 4rem;
    &__value {
        font-size: 20rem;
        width: 30px;
        text-align: end;
        font-family: 'Anonymous Pro', monospace;
        font-weight: 700;
        font-style: normal;
    }
    &__text {
        font-size: 16rem;
        font-family: 'Anonymous Pro', monospace;
        font-weight: 700;
        font-style: italic;
        margin-bottom: 1rem;
    }
}
</style>
