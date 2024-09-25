<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, Ref, ref } from 'vue';
import { IInteriorSourceDto } from '@serverentities/InteriorSource.ts';

const interiorSourceList: Ref<IInteriorSourceDto[]> = ref<IInteriorSourceDto[]>([]);
const isOpen: Ref<boolean> = ref(false);

const onStart = (_interiorSourceList: IInteriorSourceDto[]) => {
    interiorSourceList.value = _interiorSourceList;
    isOpen.value = true;
};

const onStop = () => {
    isOpen.value = false;
    interiorSourceList.value = [];
};

onBeforeMount(() => {
    alt.on('house_creation:start', onStart);
    alt.on('house_creation:stop', onStop);
});

onBeforeUnmount(() => {
    alt.off('house_creation:start', onStart);
    alt.off('house_creation:stop', onStop);
});
</script>
<template>
    <div class="houseCreation" v-if="isOpen"></div>
</template>

<style scoped lang="scss">
.houseCreation {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: min(30vw, 600rem);
    height: min(20vw, 400rem);
    background: black;
    border-radius: 10rem;
}
</style>
