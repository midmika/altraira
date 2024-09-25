<script setup lang="ts">
import type { IGateFrontend } from '../../../../../src/shared/app/gate/AbstractGate.ts';
import { onBeforeMount, onBeforeUnmount, ref, Ref } from 'vue';
import GateTrade from '@/hud/components/Gate/GateTrade.vue';

const gate: Ref<IGateFrontend | null> = ref(null);
const isToggled: Ref<boolean> = ref(false);

const isBuyLoading: Ref<boolean> = ref(false);
const buyError: Ref<string | null> = ref(null);
const isBuySuccessful: Ref<true | null> = ref(null);
const buyTimer: Ref<number> = ref(-1);

const onGate = (_gate: IGateFrontend | null) => {
    isToggled.value = false;
    isBuyLoading.value = false;
    buyError.value = null;
    isBuySuccessful.value = null;
    clearTimeout(buyTimer.value);
    buyTimer.value = -1;
    gate.value = _gate;
};

const onToggle = (state: boolean) => {
    isToggled.value = state;
};

const onBuyResult = (ok: boolean, error?: string) => {
    if (ok) {
        isBuySuccessful.value = true;
        buyTimer.value = setTimeout(() => {
            isBuySuccessful.value = null;
            isBuyLoading.value = false;
        }, 4000);
    } else if (error) {
        buyError.value = error;
        buyTimer.value = setTimeout(() => {
            buyError.value = null;
            isBuyLoading.value = false;
        }, 2000);
    }
};

const onBuy = (amount: number) => {
    if (isBuyLoading.value) return;
    isBuyLoading.value = true;
    alt.emit('gate:buy', amount, gate.value?.buyPrice);
};

onBeforeMount(() => {
    alt.on('gate:state', onGate);
    alt.on('gate:toggle', onToggle);
    alt.on('gate:buy_result', onBuyResult);
});

onBeforeUnmount(() => {
    alt.off('gate:state', onGate);
    alt.off('gate:toggle', onToggle);
    alt.off('gate:buy_result', onBuyResult);
    clearTimeout(buyTimer.value);
});
</script>
<template>
    <Transition name="fade" :duration="700">
        <div class="cont" v-if="gate">
            <div class="head">
                <!--                <img src="/icons/map/borteli.png" alt="" />-->
                <span>{{ gate.name }}</span>
            </div>

            <template v-if="gate.buyPrice !== null && gate.sellPrice !== null">
                <div class="body">
                    <span>Покупка: ${{ gate.buyPrice }}<span>/кг</span></span>
                    <span>Продажа: ${{ gate.sellPrice }}<span>/кг</span></span>
                </div>
                <div class="toggle">
                    <span>Нажмите [T], чтобы {{ isToggled ? 'закрыть' : 'купить груз' }}</span>
                    <svg
                        class="icon"
                        :style="{ height: 20 + 'rem', scale: isToggled ? 1 : -1, transform: 'rotate(90deg)' }"
                        viewBox="0 0 24 24"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                    >
                        <path
                            d="M16.1795 3.26875C15.7889 2.87823 15.1558 2.87823 14.7652 3.26875L8.12078 9.91322C6.94952 11.0845 6.94916 12.9833 8.11996 14.155L14.6903 20.7304C15.0808 21.121 15.714 21.121 16.1045 20.7304C16.495 20.3399 16.495 19.7067 16.1045 19.3162L9.53246 12.7442C9.14194 12.3536 9.14194 11.7205 9.53246 11.33L16.1795 4.68297C16.57 4.29244 16.57 3.65928 16.1795 3.26875Z"
                            fill="white"
                        />
                    </svg>
                </div>
                <Transition name="trade" :duration="400">
                    <GateTrade
                        v-if="isToggled && !isBuySuccessful"
                        :onBuy="onBuy"
                        :buyPrice="gate.buyPrice"
                        :isLoading="isBuyLoading"
                        :error="buyError"
                    />
                </Transition>
                <Transition name="trade" :duration="400">
                    <span
                        v-if="isBuySuccessful"
                        :style="{
                            padding: '6rem 12rem',
                            position: 'absolute',
                            left: 0,
                            right: 0,
                            bottom: 0,
                            transform: 'translateY(100%)',
                        }"
                        >Отгрузка произошла успешно, Вы можете забрать свой груз</span
                    >
                </Transition>
            </template>

            <div class="body" v-else>
                <span>Торги приостановлены</span>
            </div>
        </div>
    </Transition>
</template>

<style scoped lang="scss">
.cont {
    display: flex;
    flex-direction: column;
    position: absolute;
    top: 40%;
    height: fit-content;
    min-width: 300rem;
    width: 300rem;
    background: linear-gradient(180deg, rgba(0, 0, 0, 1) 0%, rgba(0, 0, 0, 0) 100%);
    transition: 250ms all ease;
}
.head {
    padding: 6rem;
    position: relative;
    overflow: hidden;
    height: 50rem;
    img {
        position: absolute;
        width: 100%;
        left: 50%;
        top: 50%;
        transform: translate(-50%, -50%);
        z-index: 9;
    }
    span {
        font-size: 20rem;
        color: rgb(255, 255, 255);
        z-index: 10;
        position: absolute;
        left: 10rem;
        top: 10rem;
        width: fit-content;
        text-shadow:
            2px 0 #000,
            -2px 0 #000,
            0 2px #000,
            0 -2px #000,
            1px 1px #000,
            -1px -1px #000,
            1px -1px #000,
            -1px 1px #000;
    }
}
.body {
    display: flex;
    flex-direction: column;
    padding: 10rem;
}

.toggle {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 6rem;
    margin-top: 12rem;
}
.icon {
    transition: 300ms all ease-out;
}

.fade-enter-active,
.fade-leave-active {
    transition: all 0.7s ease;
}
.fade-enter-from {
    transform: translateY(-20rem);
    opacity: 0;
}
.fade-leave-to {
    transform: translateY(20rem);
    opacity: 0;
}

.trade-enter-active,
.trade-leave-active {
    transition: all 0.4s ease;
}
.trade-enter-from {
    transform: translateY(calc(100% - 10rem));
    opacity: 0;
}
.trade-leave-to {
    transform: translateY(calc(100% - 10rem));
    opacity: 0;
}
</style>
