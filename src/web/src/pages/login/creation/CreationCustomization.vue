<script setup lang="ts">
import { EFaction, ICreationAllowedCustomization } from '@/shared/app/faction/Faction.ts';
import { computed, onBeforeMount, onBeforeUnmount, ref, Ref, watch } from 'vue';
import { faceNameList, femaleHairList, hairColors, maleHairList } from '@/shared/app/character_customization/const.ts';
import { ICharacterCustomization } from '@/shared/app/character_customization/AbstractCharacterCustomization.ts';

const { faction } = defineProps<{ faction: EFaction }>();

const availableOptions: Ref<ICreationAllowedCustomization | null> = ref(null);
const customization = ref<ICharacterCustomization | null>(null);

const onAvailableOptions = (v: ICreationAllowedCustomization, _default: ICharacterCustomization) => {
    availableOptions.value = v;
    customization.value = _default;
};

const isMale = computed(() => {
    return faction !== EFaction.alt;
});

const onProp = (prop: keyof ICharacterCustomization, type: any, isNext: boolean) => {
    if (!customization.value || !availableOptions.value) return;
    let opts;
    if (availableOptions.value[prop]) {
        opts = availableOptions.value[prop][type];
    }
    const currValue = customization.value[prop][type];

    if (opts) {
        const currIndex = opts.findIndex((i) => i === currValue);
        if (isNext) {
            customization.value[prop][type] =
                availableOptions.value[prop][type][currIndex + 1] ?? availableOptions.value[prop][type][0];
        } else {
            customization.value[prop][type] =
                availableOptions.value[prop][type][currIndex - 1] ??
                availableOptions.value[prop][type][availableOptions.value[prop][type].length - 1];
        }
    } else {
        let maxValue: number = -1;
        if (prop === 'parents' && (type === 'mother' || type === 'father')) {
            maxValue = faceNameList.length - 1;
        }

        if (maxValue === -1) return;

        if (isNext) {
            if (customization.value[prop][type] === maxValue) {
                customization.value[prop][type] = 0;
            } else {
                customization.value[prop][type] += 1;
            }
        } else {
            if (customization.value[prop][type] === 0) {
                customization.value[prop][type] = maxValue;
            } else {
                customization.value[prop][type] -= 1;
            }
        }
    }
};

const onPropRange = (prop: keyof ICharacterCustomization, type: any, e: Event) => {
    customization.value[prop][type] = Number(e.target!.value);
};

watch(
    customization,
    (val) => {
        alt.emit('login:creation:update_customization', val);
    },
    { deep: true },
);

onBeforeMount(() => {
    alt.on('login:creation:available_customization', onAvailableOptions);
});

onBeforeUnmount(() => {
    alt.off('login:creation:available_customization', onAvailableOptions);
});
</script>

<template>
    <div class="cont">
        <h1>Персонализация</h1>
        <template v-if="faction === EFaction.ghoul">
            <span>Какая персонализация? Ты же мейнстримный клоун</span>
        </template>
        <template v-else-if="availableOptions && customization">
            <div :style="{ display: 'flex', gap: '10rem' }">
                <div class="switch-item" :style="{ width: 'calc(50% - 5rem)' }">
                    <span>Мать</span>
                    <div class="switch-wrapper">
                        <div class="switch-arrow" @click="onProp('parents', 'mother', false)">
                            {{ '<' }}
                        </div>
                        <div class="switch">
                            <span class="switch__text">{{ faceNameList[customization.parents.mother] }}</span>
                        </div>
                        <div class="switch-arrow" @click="onProp('parents', 'mother', true)">
                            {{ '>' }}
                        </div>
                    </div>
                </div>
                <div class="switch-item" :style="{ width: 'calc(50% - 5rem)' }">
                    <span>Отец</span>
                    <div class="switch-wrapper">
                        <div class="switch-arrow" @click="onProp('parents', 'father', false)">
                            {{ '<' }}
                        </div>
                        <div class="switch">
                            <span class="switch__text">{{ faceNameList[customization.parents.father] }}</span>
                        </div>
                        <div class="switch-arrow" @click="onProp('parents', 'father', true)">
                            {{ '>' }}
                        </div>
                    </div>
                </div>
            </div>

            <div :style="{ display: 'flex', gap: '10rem' }">
                <div class="switch-item" :style="{ width: 'calc(50% - 5rem)' }">
                    <h4>Цвет кожи</h4>
                    <div class="switch-wrapper">
                        <div class="switch">
                            <input
                                type="range"
                                min="-1"
                                max="1"
                                step="0.1"
                                :value="customization.parents.skinMix"
                                @input="(e) => onPropRange('parents', 'skinMix', e)"
                            />
                        </div>
                    </div>
                </div>
                <div class="switch-item" :style="{ width: 'calc(50% - 5rem)' }">
                    <h4>Схожесть лица</h4>
                    <div class="switch-wrapper">
                        <div class="switch">
                            <input
                                type="range"
                                min="-1"
                                max="1"
                                step="0.1"
                                :value="customization.parents.faceMix"
                                @input="(e) => onPropRange('parents', 'faceMix', e)"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <div class="switch-item" v-if="availableOptions.hairs.index.length > 1">
                <h4>Стиль волос</h4>
                <div class="switch-wrapper">
                    <div class="switch-arrow" @click="onProp('hairs', 'index', false)">
                        {{ '<' }}
                    </div>
                    <div class="switch">
                        <span class="switch__text">{{
                            isMale ? maleHairList[customization.hairs.index] : femaleHairList[customization.hairs.index]
                        }}</span>
                    </div>
                    <div class="switch-arrow" @click="onProp('hairs', 'index', true)">
                        {{ '>' }}
                    </div>
                </div>
            </div>

            <div :style="{ display: 'flex', gap: '10rem' }">
                <div
                    class="switch-item"
                    v-if="availableOptions.hairs.color1.length > 1"
                    :style="{ width: 'calc(50% - 5rem)' }"
                >
                    <h4>Основной цвет волос</h4>
                    <div class="switch-wrapper">
                        <div class="switch-arrow" @click="onProp('hairs', 'color1', false)">
                            {{ '<' }}
                        </div>
                        <div class="switch">
                            <span class="switch__text">{{ hairColors[customization.hairs.color1] }}</span>
                        </div>
                        <div class="switch-arrow" @click="onProp('hairs', 'color1', true)">
                            {{ '>' }}
                        </div>
                    </div>
                </div>
                <div
                    class="switch-item"
                    v-if="availableOptions.hairs.color2.length > 1"
                    :style="{ width: 'calc(50% - 5rem)' }"
                >
                    <h4>Дополнительный волос</h4>
                    <div class="switch-wrapper">
                        <div class="switch-arrow" @click="onProp('hairs', 'color2', false)">
                            {{ '<' }}
                        </div>
                        <div class="switch">
                            <span class="switch__text">{{ hairColors[customization.hairs.color2] }}</span>
                        </div>
                        <div class="switch-arrow" @click="onProp('hairs', 'color2', true)">
                            {{ '>' }}
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<style scoped lang="scss">
.cont {
    display: flex;
    flex-direction: column;
    padding: 20rem;
    margin-left: auto;
    width: 400rem;
    max-width: 100%;
}
.switch {
    display: flex;
    flex-grow: 1;
    align-items: center;
    justify-content: center;
    &-wrapper {
        display: flex;
        align-items: center;
    }
    &-arrow {
        font-size: 20rem;
        border: 1px solid white;
        padding: 2rem 6rem;
    }
    &__text {
        width: fit-content;
        height: fit-content;
    }
    &-item {
        display: flex;
        flex-direction: column;
        gap: 6rem;
    }
}
</style>
