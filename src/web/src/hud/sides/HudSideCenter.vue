<script setup lang="ts"></script>

<template>
    <div class="hud-item">
        <slot />
    </div>
</template>

<style scoped lang="scss">
.hud-item {
    grid-area: center;
    align-items: center;
    display: flex;
    flex-direction: column;
}
</style>
