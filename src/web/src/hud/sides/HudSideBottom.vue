<script setup lang="ts"></script>

<template>
    <div class="hud-item">
        <slot />
    </div>
</template>

<style scoped lang="scss">
.hud-item {
    grid-area: bottom;
    display: flex;
}
</style>
