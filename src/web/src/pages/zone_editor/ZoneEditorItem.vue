<script setup lang="ts">
import { IVector2 } from '@/types.ts';
import { toDeepRaw } from '@/utils/ref.ts';

interface IProps {
    name: string;
    hash: string;
    polygon: IVector2[];
    id: number;
    __height: number;
    isSelected: boolean;
    isExpanded: boolean;
}

const { name, hash, polygon, isSelected, id } = defineProps<IProps>();

const emit = defineEmits(['delete', 'highlight', 'update', 'update', 'select', 'expand', 'highlightApex']);

const deleteApex = (apex: { x: number; y: number }) => {
    const res = polygon.filter((i) => i.y !== apex.y && i.x !== apex.x);
    emit('update', 'polygon', toDeepRaw(res));
};
</script>

<template>
    <div
        class="item"
        :class="isSelected && 'active'"
        @mouseenter="emit('highlight', id)"
        @mouseleave="emit('highlight', null)"
    >
        <div class="prev">
            <span class="prev-btn" @click="emit('expand')">{{ isExpanded ? 'Свернуть' : 'Развернуть' }}</span>
            <span class="prev-hash" v-if="!isExpanded">{{ hash }}</span>
        </div>
        <template v-if="isExpanded">
            <div class="line">
                <span>Название</span>
                <input type="text" :value="name" @input="(e) => emit('update', 'name', e.target!.value as string)" />
            </div>
            <div class="line">
                <span>Хэш</span>
                <input
                    type="text"
                    :disabled="!isExpanded"
                    :value="hash"
                    @input="(e) => emit('update', 'hash', e.target!.value as string)"
                />
            </div>
            <div class="line">
                <span>Высота (debug)</span>
                <input
                    type="number"
                    :value="__height"
                    @input="(e) => emit('update', '_debug_height', Number(e.target!.value))"
                />
            </div>

            <div :style="{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }">
                <span :style="{ fontWeight: 'bold', fontSize: '18rem' }">Вершины ({{ polygon.length }})</span>
            </div>

            <div class="polygon">
                <div
                    class="polygon-item"
                    v-for="(apex, index) of polygon"
                    :key="'item' + index"
                    @mouseenter="emit('highlightApex', apex)"
                    @mouseleave="emit('highlightApex', null)"
                >
                    <span>{{ Number(apex.x).toFixed(2) }}, {{ Number(apex.y).toFixed(2) }}</span>
                    <span @click="deleteApex(apex)" class="polygon-item__x"> x </span>
                </div>
            </div>

            <button @click="isSelected ? emit('select', null) : emit('select', id)">
                {{ isSelected ? 'Отменить редактирование' : 'Редактировать' }}
            </button>
            <button @click="emit('delete', name)" class="delete">Удалить зону</button>
        </template>
    </div>
</template>

<style scoped lang="scss">
.polygon {
    display: flex;
    flex-wrap: wrap;
    gap: 4rem;
    &-item {
        padding: 2rem 5rem;
        border: 1px solid white;
        cursor: pointer;
        &__x {
            border: 1px solid white;
            margin-left: 4rem;
            font-weight: bold;
            text-align: center;
            padding-right: 6rem;
            transition: 250ms all ease;
            &:hover {
                background: white;
                color: black;
                border: 1px solid black;
            }
        }
    }
}
.prev {
    display: flex;
    justify-content: space-between;
    align-items: center;
    &-btn {
        padding: 4px;
        border: 1px solid white;
        width: fit-content;
        transition: 250ms all ease;
        &:hover {
            background: white;
            color: black;
        }
    }
}

.delete {
    background: rgba(red, 0.1);
    &:hover {
        background: red;
        color: white;
    }
}

.item {
    display: flex;
    flex-direction: column;
    gap: 8rem;
    border: 1px solid white;
    padding: 6rem;

    transition: 250ms all ease;
    &.active {
        box-shadow: inset 0 0 10px white;
    }
}
.line {
    display: flex;
    gap: 6rem;
    span,
    input {
        width: calc(50% - 3rem);
    }
    input {
        border: none;
        border-bottom: 1px solid white;
        background: transparent;
        outline: none;
        color: white;
        font-size: 16rem;
        padding: 2rem 4rem;
    }
}
</style>
