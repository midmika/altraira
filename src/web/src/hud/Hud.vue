<script setup lang="ts">
import { computed, onBeforeMount, onMounted, Ref, ref } from 'vue';
import HudSideBottom from '@/hud/sides/HudSideBottom.vue';
import HudSideLeft from '@/hud/sides/HudSideLeft.vue';
import HudSideRight from '@/hud/sides/HudSideRight.vue';
import HudUpMap from '@/hud/components/HudUpMap.vue';
import HudSideCenter from '@/hud/sides/HudSideCenter.vue';
import HudBalance from '@/hud/components/HudBalance.vue';
import HudMenu from '@/hud/components/menu/HudMenu.vue';
import HudPosDebug from '@/hud/components/HudPosDebug.vue';
import { IFrontendSafeZone } from '@/shared/types';
import Location from '@/hud/components/Location/Location.vue';

const safeZone: Ref<IFrontendSafeZone | null> = ref<IFrontendSafeZone | null>(null);

const onSafeZone = (_safeZone: IFrontendSafeZone) => {
    safeZone.value = _safeZone;
};

const hudStyles = computed<any>(() => {
    if (!safeZone.value) return {};
    return {
        left: safeZone.value!.x + 'px',
        right: safeZone.value!.x + 'px',
        top: safeZone.value!.y + 'px',
        bottom: safeZone.value!.y + 'px',
        gridTemplateColumns: `${safeZone.value.width}px 1fr ${safeZone.value.width}px`,
        gridTemplateRows: `1fr ${safeZone.value.height}px`,
    };
});

onMounted(() => {
    alt.emit('safeZone');
    alt.on('safeZone', onSafeZone);
});

onBeforeMount(() => {
    alt.off('safeZone', onSafeZone);
});
</script>

<template>
    <div v-if="safeZone" class="hud" :style="hudStyles">
        <HudSideLeft>
            <HudPosDebug />
            <!--            <HudKeyHelper />-->
            <HudUpMap />
        </HudSideLeft>
        <HudSideBottom>
            <HudBalance />
            <!--            <HudBalance />-->
        </HudSideBottom>
        <HudSideRight>
            <!--            <Gate />-->
            <HudMenu />
            <!--            <HudComputer />-->
            <!--            <HudLogo />-->
        </HudSideRight>
        <HudSideCenter>
            <Location />
        </HudSideCenter>
    </div>
</template>

<style scoped lang="scss">
.hud {
    position: absolute;
    display: grid;
    grid-template-areas:
        'left center right'
        '. bottom right';
    gap: 12rem;

    &-temppos {
        font-size: 14rem;
        color: white;
        display: flex;
        flex-direction: column;
        padding: 12rem;
        background: #171717;
        gap: 6rem;
        height: fit-content;
        width: fit-content;
    }
}
</style>
