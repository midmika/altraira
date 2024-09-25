<script setup lang="ts"></script>

<template>
    <div class="fullscreen">
        <slot />
    </div>
</template>

<style scoped lang="scss">
.fullscreen {
    position: absolute;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    display: flex;
    z-index: 100;
    width: 100vw;
    height: 100vh;
}
</style>
