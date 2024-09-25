<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue';

interface IHudKeyHelperItem {
    label: string;
    keycode: string;
}

const list: Ref<IHudKeyHelperItem[]> = ref<IHudKeyHelperItem[]>([]);

onMounted(() => {
    list.value = [...list.value, { keycode: 'F3', label: 'Лог ивентов' }];
});
</script>

<template>
    <div class="cont">
        <div class="cont-item" v-for="item of list" :key="item.label">
            <span class="cont-item__keycode">{{ item.keycode }}</span>
            <span class="cont-item__label">{{ item.label }}</span>
        </div>
    </div>
</template>

<style scoped lang="scss">
.cont {
    display: flex;
    flex-direction: column;
    gap: 12rem;
    margin-top: auto;
    &-item {
        display: flex;
        align-items: center;
        gap: 8rem;
        font-size: 16rem;
        color: white;
        &__keycode {
            padding: 6rem 8rem;
            background: #171717;
            border: 1px solid white;
            box-shadow: 0 0 4rem white;
            border-radius: 4rem;
        }
    }
}
</style>
