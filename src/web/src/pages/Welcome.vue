<script setup lang="ts">
import FullscreenWrapper from '@/FullscreenWrapper.vue';
import { onBeforeMount, onBeforeUnmount, Ref, ref } from 'vue';

const loadingPrefix: Ref<string> = ref<string>('');

let timer: number;

onBeforeMount(() => {
    timer = setInterval(() => {
        if (loadingPrefix.value === '...') {
            loadingPrefix.value = '';
        } else {
            loadingPrefix.value += '.';
        }
    }, 500);
});

onBeforeUnmount(() => {
    clearInterval(timer);
});
</script>

<template>
    <FullscreenWrapper>
        <div class="welcome">
            <div class="welcome-left">
                <div class="welcome-left-logo">
                    <span class="welcome-left-logo__logo">WTF</span>
                </div>
                <span class="welcome-left__loading">
                    Loading
                    <span class="welcome-left__loading_dots">{{ loadingPrefix }}</span>
                </span>
            </div>
            <div class="welcome-right">
                <img src="../assets/welcome.png" alt="" />
            </div>
        </div>
    </FullscreenWrapper>
</template>

<style scoped lang="scss">
.welcome {
    width: 100vw;
    height: 100vh;
    display: flex;
    background: black;
    &-left {
        width: 50%;
        color: white;
        padding: 20rem;
        display: flex;
        flex-direction: column;
        gap: 12rem;
        justify-content: center;
        align-items: center;
        &-logo {
            display: flex;
            gap: 12rem;
            &__logo {
                font-size: 50rem;
                font-weight: bold;
                text-shadow: 0 0 10rem #d3b92f;
                color: #d3b92f;
            }
            &__rp {
                align-self: end;
                margin-bottom: 4rem;
                font-size: 30rem;
                color: white;
                color: rgba(211, 185, 47, 0.7);
                text-shadow: 0 0 6rem rgba(211, 185, 47, 0.7);
            }
        }
        &__loading {
            font-size: 24rem;
            text-shadow: 0 0 10rem white;
            position: relative;
            animation: welcome-loading-text 2s infinite;
            @keyframes welcome-loading-text {
                0% {
                    opacity: 1;
                    text-shadow: 0 0 6rem white;
                }
                50% {
                    opacity: 0.5;
                    text-shadow: 0 0 0 white;
                }
                100% {
                    opacity: 1;
                    text-shadow: 0 0 6rem white;
                }
            }
        }
        &__loading_dots {
            position: absolute;
            font-size: 24rem;
            right: 0;
            top: 0;
            bottom: 0;
            transform: translateX(calc(100% + 4rem));
        }
    }
    &-right {
        width: 50%;
        font-size: 50rem;
        color: white;
        position: relative;
        overflow: hidden;
        img {
            position: absolute;
            left: 50%;
            width: 100%;
            transform: translate(-50%);
        }
    }
}

.fade-enter-active,
.fade-leave-active {
    transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
