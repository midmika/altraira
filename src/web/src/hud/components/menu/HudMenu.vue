<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, ref, Ref } from 'vue';
import IconClose from '@/icons/IconClose.vue';
import MenuVehicles from '@/hud/components/menu/MenuVehicles.vue';

const isOpen: Ref<boolean> = ref(false);

const onOpen = (val: boolean) => {
    isOpen.value = val;
};

const close = () => {
    alt.emit('menu:close');
};

onBeforeMount(() => {
    alt.on('menu:toggle', onOpen);
});

onBeforeUnmount(() => {
    alt.off('menu:toggle', onOpen);
});
</script>

<template>
    <div class="menu" v-if="isOpen">
        <div class="menu-head">
            <span class="menu-head__title">Меню</span>
            <IconClose @click="close" size="large" cursor="pointer" />
        </div>
        <div class="menu-body">
            <div class="menu-body-top">
                <MenuVehicles />
                <div class="a">
                    <span class="a__label">Достижения</span>
                    <div class="a-content">
                        <div class="a-item">
                            <span class="a-item__item">Всего проехано</span>
                            <span class="a-item__item">20</span>
                        </div>
                        <div class="a-item">
                            <span class="a-item__item">Всего заработано</span>
                            <span class="a-item__item">$300</span>
                        </div>
                        <div class="a-item">
                            <span class="a-item__item">Время наиграно</span>
                            <span class="a-item__item">8д. 7ч. 12м.</span>
                        </div>
                    </div>
                </div>
            </div>

            <div class="menu-body-about">
                <span>Разработано с ❤️ и 🤬 ️</span>
                <div class="menu-body-about-links">
                    <a href="https://t.me/midmika" target="_blank">Telegram</a>
                    <a href="https://github.com/midmika" target="_blank">GitHub</a>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped lang="scss">
.menu {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    align-items: center;
    display: flex;
    flex-direction: column;
    border: 1px solid white;
    background: rgba(black, 0.95);

    z-index: 10000;

    &-head {
        display: flex;
        justify-content: space-between;
        padding: 12rem 16rem;
        border-bottom: 1px solid white;
        align-items: center;
        height: fit-content;
        width: calc(100% - 32rem);
        &__title {
            font-size: 22rem;
            font-weight: bold;
        }
    }

    &-body {
        display: flex;
        flex-direction: column;
        flex-grow: 1;
        width: calc(100% - 32rem);
        padding: 12rem 16rem;
        gap: 24rem;

        &-top {
            display: flex;
            flex-direction: column;
            gap: 24rem;
            justify-content: space-between;
        }

        &-about {
            display: flex;
            flex-direction: column;
            gap: 8rem;
            align-items: center;
            margin-top: auto;
            width: fit-content;
            align-self: center;
            &-links {
                display: flex;
                gap: 12rem;
                text-align: end;
            }

            a {
                color: #02a602;
                font-weight: bold;
                cursor: pointer;
            }
        }
    }
}

.a {
    display: flex;
    flex-direction: column;
    gap: 12rem;
    &__label {
        font-size: 22rem;
    }
    &-content {
        display: flex;
        flex-direction: column;
        gap: 8rem;
    }
    &-item {
        display: flex;
        justify-content: space-between;
        border-bottom: 1px solid white;
        padding-bottom: 6rem;
        gap: 18rem;
    }
}

.toggle {
    display: flex;
    align-items: center;
    gap: 6rem;
}
.icon {
    transition: 300ms all ease-out;
}

.show-enter-active,
.show-leave-active {
    transition: all 0.4s ease;
}
.show-enter-from {
    transform: translate(-100%, 20rem);
    opacity: 0;
}
.show-leave-to {
    transform: translate(-100%, 20rem);
    opacity: 0;
}
</style>
