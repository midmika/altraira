<script setup lang="ts"></script>

<template>
    <div class="hud-item">
        <slot />
    </div>
</template>

<style scoped lang="scss">
.hud-item {
    grid-area: right;
    align-items: end;
    display: flex;
    flex-direction: column;
}
</style>
