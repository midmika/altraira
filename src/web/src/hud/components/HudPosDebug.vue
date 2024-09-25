<script setup lang="ts">
import { useHudStore } from '@/store/hudStore.ts';

const store = useHudStore();
</script>

<template>
    <div class="hud-temppos" v-if="store.debug">
        <span>X: {{ store.debug.x }}</span>
        <span>Y: {{ store.debug.y }}</span>
        <span>Z: {{ store.debug.z }}</span>
        <span>H: {{ store.debug.h }}</span>
    </div>
</template>

<style scoped lang="scss"></style>
