<script setup lang="ts">
import { EFaction } from '@/shared/app/faction/Faction.ts';

const { selectedFaction } = defineProps<{ selectedFaction: EFaction }>();
const emit = defineEmits(['select']);
</script>

<template>
    <div class="faction">
        <span>Фракция</span>
        <div
            class="faction-item"
            @click="emit('select', EFaction.ryodan)"
            :class="[selectedFaction === EFaction.ryodan && 'active']"
        >
            <span class="ghoul">ЧВК Редан</span>
            <img
                class="faction-item__bg"
                src="/public/logo/ghoul.png"
                alt=""
                :style="{ position: 'absolute', height: '175%', right: '11%', bottom: '-35%' }"
            />
        </div>
        <div
            class="faction-item"
            @click="emit('select', EFaction.alt)"
            :class="[selectedFaction === EFaction.alt && 'active']"
        >
            <span class="alt">Альтушка</span>
            <img
                class="faction-item__bg"
                src="/public/logo/alt.png"
                alt=""
                :style="{ position: 'absolute', height: '175%', right: '10%', bottom: '-35%' }"
            />
        </div>
        <div
            class="faction-item"
            @click="emit('select', EFaction.skuf)"
            :class="[selectedFaction === EFaction.skuf && 'active']"
        >
            <span class="skuf">Скуф</span>
            <img
                class="faction-item__bg"
                src="/public/logo/skuf.png"
                alt=""
                :style="{
                    position: 'absolute',
                    height: '200%',
                    width: '43%',
                    right: '3%',
                    bottom: '-50%',
                    transform: 'rotate(-10deg)',
                }"
            />
        </div>
    </div>
</template>

<style scoped lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Great+Vibes&display=swap');
@import url('https://fonts.cdnfonts.com/css/times-new-roman');
@import url('https://fonts.cdnfonts.com/css/black-dread');

.faction {
    display: flex;
    flex-direction: column;
    gap: 8rem;
    font-size: 40rem;
    width: 450rem;
    max-width: 100%;
    &-item {
        padding: 20rem;
        background: linear-gradient(90deg, transparent, black);
        position: relative;
        overflow: hidden;
        transition: background 300ms ease-out;
        background-size: 200% 1px;
        display: flex;
        &:hover {
            background-position: 100%;
        }
        &.active {
            background-position: 100%;
        }
    }
}

.alt {
    font-family: 'Great Vibes', cursive !important;
    font-weight: 600;
    font-style: normal;
}
.skuf {
    font-family: 'Times New Roman', sans-serif !important;
    font-weight: 400;
    font-style: normal;
}
.ghoul {
    font-family: 'Black Dread', sans-serif !important;
}
</style>
