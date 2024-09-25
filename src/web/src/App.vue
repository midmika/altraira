<script setup lang="ts">
import CommandLine from './components/CommandLine/CommandLine.vue';
import Volos from '@/components/Volos/Volos.vue';
import { onBeforeMount, onBeforeUnmount, Ref, ref } from 'vue';
import Logger from '@/admin/Logger/Logger.vue';
import ZoneCreator from '@/pages/zone_editor/ZoneEditor.vue';
import { IFrontendState } from '@/shared/types';
import Hud from '@/hud/Hud.vue';
import Login from '@/pages/login/Login.vue';
import Welcome from '@/pages/Welcome.vue';
import Map from '@/pages/map/Map.vue';
import 'vue';

const state: Ref<IFrontendState> = ref<IFrontendState>('loading');
const isMapOpen = ref<boolean>(false);

const onSetState = (_state: IFrontendState) => {
    state.value = _state;
};

const onToggleMap = (val: boolean) => {
    isMapOpen.value = val;
};

onBeforeMount(() => {
    alt.on('__state__', onSetState);
    alt.on('map_state', onToggleMap);
    alt.emit('mounted');
});

onBeforeUnmount(() => {
    alt.off('__state__', onSetState);
    alt.off('map_state', onToggleMap);
});
</script>

<template>
    <Transition name="fade" :duration="1000">
        <Hud v-if="state === 'hud'" />
        <Login v-else-if="state === 'login'" />
        <Welcome v-else-if="state === 'loading'" />
    </Transition>

    <Map :isOpen="isMapOpen" />

    <CommandLine />
    <Logger />
    <Volos />
    <ZoneCreator />
    <!--    <Creation />-->

    <!--  <AttachComponent/>-->
    <!--        <Hud />-->
    <!--    <Banner>-->
    <!--        <Inventory />-->
    <!--    </Banner>-->
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
    transition: opacity 1s ease;
}

.fade-enter-from,
.fade-leave-to {
    opacity: 0;
}
</style>
