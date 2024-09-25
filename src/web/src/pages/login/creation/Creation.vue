<script setup lang="ts">
import { ref } from 'vue';
import { EFaction } from '@/shared/app/faction/Faction.ts';
import CreationFaction from '@/pages/login/creation/CreationFaction.vue';
import CreationCustomization from '@/pages/login/creation/CreationCustomization.vue';
import CreationNickname from '@/pages/login/creation/CreationNickname.vue';

const selectedFaction = ref(EFaction.ryodan);

const selectFaction = (val: EFaction) => {
    if (val === selectedFaction.value) return;
    selectedFaction.value = val;
    alt.emit('login:creation:select_faction', val);
};

const back = () => {
    alt.emit('login:creation:cancel');
};
</script>

<template>
    <div class="creation">
        <div class="creation-faction">
            <CreationFaction @select="selectFaction" :selectedFaction="selectedFaction" />
            <button @click="back">К персонажам</button>
        </div>
        <div class="creation-customization">
            <CreationCustomization :faction="selectedFaction" />
        </div>
        <div class="creation-nickname">
            <CreationNickname />
        </div>
    </div>
</template>

<style scoped lang="scss">
.creation {
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 100%;
    height: 100%;
    display: flex;
    &-faction {
        position: absolute;
        left: 0;
        top: 0;
        bottom: 0;
        padding: 20rem;
        background: linear-gradient(90deg, rgba(black, 0.9), transparent);
        width: 30vw;
    }
    &-customization {
        position: absolute;
        right: 0;
        top: 0;
        bottom: 0;
        width: 30vw;
        background: linear-gradient(90deg, transparent, rgba(black, 0.9));
    }
    &-nickname {
        position: absolute;
        bottom: 0;
        left: 0;
        right: 0;
        padding: 20rem 30rem;
        background: linear-gradient(transparent, rgba(black, 0.9));
        display: flex;
        justify-content: center;
    }
}
</style>
