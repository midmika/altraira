<script setup lang="ts">
import { computed, ComputedRef, onMounted, Ref, ref } from 'vue';
import { format$ } from '@/utils/$.ts';

const MIN_VALUE = 30;
const MAX_VALUE = 100;

const { onBuy, buyPrice, isLoading, error } = defineProps<{
    onBuy: (val: number) => unknown;
    buyPrice: number;
    isLoading: boolean;
    error: string | null;
}>();

const thumbRef: Ref<HTMLElement | null> = ref(null);
const amount: Ref<number> = ref(30);

const thumbOffset: ComputedRef<number> = computed(() =>
    Number((((amount.value - MIN_VALUE) / (MAX_VALUE - MIN_VALUE)) * 100).toFixed(0)),
);
const totalPrice: ComputedRef<number> = computed(() => amount.value * buyPrice);

onMounted(() => {
    const item: HTMLElement | null = thumbRef.value;
    if (!item) return;
    const rect = item.getBoundingClientRect();
    const centerX = rect.left + 6;
    const centerY = rect.top + rect.height / 1.7;
    alt.emit('gate:trade_cursor_pos', centerX, centerY);
});
</script>

<template>
    <div class="trade">
        <span>Выберите необходимое количество груза, от {{ MIN_VALUE }} до {{ MAX_VALUE }} кг</span>
        <div class="slider">
            <div class="thumb" ref="thumbRef">
                <span class="thumb__count" :style="{ position: 'absolute', left: thumbOffset + '%' }"
                    >{{ amount }} кг</span
                >
            </div>
            <input
                class="slider__input"
                type="range"
                :min="MIN_VALUE"
                :max="MAX_VALUE"
                :step="1"
                v-model="amount"
                :disabled="isLoading"
            />
        </div>
        <br />
        <span>Итоговая цена: ${{ format$(totalPrice) }}</span>
        <button :disabled="isLoading" :class="[error && 'error']" @click="() => onBuy(amount)">
            {{ error ? error : isLoading ? 'Отгружаем...' : 'Купить' }}
        </button>
    </div>
</template>

<style scoped lang="scss">
.trade {
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    gap: 6rem;
    padding: 10rem;
    transform: translateY(100%);
    &-hint {
        display: flex;
        justify-content: space-between;
    }
    &::selection {
        outline: none;
    }
    &:focus {
        outline: none;
    }
}
.thumb {
    position: absolute;
    left: 12rem;
    right: 34rem;
    top: 0;
    bottom: 0;
    &__count {
        display: flex;
        justify-content: center;
        text-align: center;
        width: 60rem;
        position: absolute;
        transform: translate(-20rem, 50rem);
    }
}
.slider {
    display: flex;
    position: relative;
    padding: 20rem 0;
    &__input {
        width: 100%;
        -webkit-appearance: none;
        background: transparent;
        cursor: pointer;

        &::-webkit-slider-thumb {
            background-image: url('/icons/gatecargo.svg');
            background-position: center center;
            background-size: 30rem;
            background-clip: content-box;
            background-repeat: no-repeat;
            width: 40rem;
            -webkit-appearance: none;
            height: 40rem;
            cursor: pointer;
            margin-top: -15rem;
            position: relative;
            &:focus {
                outline: none;
            }
        }

        &::-webkit-slider-runnable-track {
            height: 12rem;
            -webkit-appearance: none;
            background: rgba(white, 0.2);
            &:focus {
                outline: none;
            }
        }

        &:focus {
            outline: none;
        }
    }
}
</style>
