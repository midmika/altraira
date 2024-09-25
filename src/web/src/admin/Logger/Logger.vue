<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, Ref, ref } from 'vue';

const list: Ref<string[]> = ref([]);

onBeforeMount(() => {
    alt.on('weblogger', (val) => list.value.unshift(val));
});

onBeforeUnmount(() => {
    alt.off('weblogger', (val) => list.value.unshift(val));
});
</script>

<template>
    <div class="cont">
        <span v-for="(i, index) in list" class="log" :key="index">{{ i }}</span>
    </div>
</template>

<style scoped lang="scss">
.cont {
    display: flex;
    flex-direction: column-reverse;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 20rem;
    max-height: 400rem;
    height: 300rem;
    min-width: 600rem;
    background: rgba(black, 0.3);
    overflow: hidden;
    padding: 10rem;
    white-space: nowrap;
}
.log {
    opacity: 1;
    transition: 250ms all ease;
}
</style>
