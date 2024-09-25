<script setup lang="ts">
import { format$ } from '@/utils/$.ts';
import { useHudStore } from '@/store/hudStore.ts';

const store = useHudStore();
</script>

<template>
    <span class="balance">${{ format$(store.dollars) }}</span>
</template>

<style scoped lang="scss">
.balance {
    margin-top: auto;
    font-size: 24rem;
    line-height: 34rem;
    font-weight: bold;
    color: white;
}
</style>
