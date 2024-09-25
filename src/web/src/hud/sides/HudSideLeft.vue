<script setup lang="ts"></script>

<template>
    <div class="hud-item">
        <slot />
    </div>
</template>

<style scoped lang="scss">
.hud-item {
    grid-area: left;
    align-items: start;
    display: flex;
    flex-direction: column;
}
</style>
