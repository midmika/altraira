<script setup lang="ts">
import { useHudStore } from '@/store/hudStore.ts';
import { ref, watch } from 'vue';

const store = useHudStore();
const timer = ref(-1);
const isShow = ref(false);

const clear = () => {
    clearTimeout(timer.value);
    isShow.value = false;
};

watch(
    () => store.location,
    (newValue, oldValue) => {
        console.log(`Значение изменилось с ${oldValue} на ${newValue}`);
        if (!newValue) {
            clear();
            return;
        }

        if (newValue !== oldValue) {
            isShow.value = true;
            timer.value = setTimeout(clear, 1500);
        }
    },
);
// watch(store, (v) => console.log(v.location));
</script>

<template>
    <Transition name="location-ts" :duration="400">
        <div class="location" v-if="isShow">
            <div class="location-current">
                <span>{{ store.location }}</span>
            </div>
        </div>
    </Transition>
</template>

<style scoped lang="scss">
.location {
    display: flex;
    flex-direction: row;
    align-items: center;
    position: relative;
    box-shadow: inset 0 0 100rem rgba(black, 0.8);
    padding: 0 20rem;

    &:before,
    &:after {
        content: '';
        position: absolute;
        left: 0;
        right: 0;
        height: 2rem;
        background: white;
    }
    &:before {
        top: 0;
    }
    &:after {
        bottom: 0;
    }
    &-current {
        text-align: center;
        width: 400rem;
        padding: 16rem;
        font-size: 30rem;
        font-weight: bold;
        color: var(--color);
        text-shadow:
            -1px -1px 0 #000,
            1px -1px 0 #000,
            -1px 1px 0 #000,
            1px 1px 0 #000;
    }
}

.location-ts-enter-active,
.location-ts-leave-active {
    transition: all 0.4s ease;
}
.location-ts-enter-from {
    transform: translateY(-10rem);
    opacity: 0;
}
.location-ts-leave-to {
    transform: translateY(-10rem);
    opacity: 0;
}
</style>
