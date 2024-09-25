<script setup lang="ts">
import Fullscreen from '@/Fullscreen.vue';
import Creation from '@/pages/login/creation/Creation.vue';
import { onBeforeMount, onBeforeUnmount, ref } from 'vue';
import Selection from '@/pages/login/selection/Selection.vue';

const isMainScreen = ref(false);

const onPhase = (phase: boolean) => (isMainScreen.value = phase);

onBeforeMount(() => {
    alt.on('login:phase', onPhase);
});

onBeforeUnmount(() => {
    alt.on('login:phase', onPhase);
});
</script>

<template>
    <Fullscreen>
        <Selection v-if="isMainScreen" />
        <Creation v-else />
    </Fullscreen>
</template>

<style scoped lang="scss">
.login {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    width: 30vw;
    padding: 20rem;
    background: linear-gradient(90deg, rgba(black, 0.9), transparent);
}
</style>
