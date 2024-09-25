<script setup lang="ts"></script>

<template>
    <div class="wrapper">
        <slot />
    </div>
</template>

<style scoped lang="scss">
.wrapper {
    position: absolute;
    left: 0;
    top: 0;
    right: 0;
    bottom: 0;
    z-index: 1000;
}
</style>
