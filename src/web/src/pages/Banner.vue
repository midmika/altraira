<script setup lang="ts"></script>

<template>
    <div class="banner">
        <div class="banner-inner">
            <slot />
        </div>
        <div class="banner-bg"></div>
    </div>
</template>

<style scoped lang="scss">
.banner {
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    &-inner {
        z-index: 102;
    }
    &-bg {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        z-index: 101;
        background: rgba(black, 0.95);
    }
}
</style>
