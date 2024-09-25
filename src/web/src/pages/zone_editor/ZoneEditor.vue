<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, Ref, ref } from 'vue';
import ZoneEditorItem from '@/pages/zone_editor/ZoneEditorItem.vue';
import { IZoneDebugDto, IZoneDto } from '@/shared/app/zone/AbstractZone';
import { IVector2 } from '@/types.ts';
import { toDeepRaw } from '@/utils/ref.ts';
import { sortVertices } from '@/shared/utils/sortVertices.ts';

const list: Ref<IZoneDebugDto[]> = ref([]);
const isOpen: Ref<boolean> = ref(false);
const selectedId: Ref<number | null> = ref(null);
const expandedId: Ref<number> = ref(-1);

function generateRandomHash(length: number) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let hash = '';
    for (let i = 0; i < length; i++) {
        hash += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return hash;
}

const onToggle = (state: boolean, _list: IZoneDebugDto[]) => {
    isOpen.value = state;
    if (!list.value.length) {
        list.value = _list;
    }
};

const createTemplate = () => {
    const item: IZoneDto = {
        id: Math.random(),
        _debug_height: 70,
        name: 'name_' + generateRandomHash(12),
        hash: 'hash_' + generateRandomHash(12),
        polygon: [],
    };
    list.value.push(item);
    alt.emit('zone_editor:add_item', toDeepRaw(item));
};

const onDelete = (index: number) => {
    const item = list.value[index];
    list.value = list.value.filter((_, _index) => _index !== index);
    alt.emit('zone_editor:delete_item', toDeepRaw(item));
};

const onAddApex = (apex: IVector2) => {
    const index = list.value.findIndex((i) => i.id === selectedId.value);
    const raw = toDeepRaw(list.value[index].polygon);
    list.value[index].polygon = sortVertices([...raw, apex]);
    alt.emit('zone_editor:update_item', toDeepRaw(list.value[index]));
};

const onHighlight = (id: number) => {
    alt.emit('zone_editor:highlight', id);
};

const onHighlightApex = (apex: any) => {
    alt.emit('zone_editor:highlight_apex', apex);
};

const onSelect = (id: number) => {
    alt.emit('zone_editor:select', id);
    selectedId.value = id;
};

const update = (index: number, key: keyof IZoneDto, value: any) => {
    const _: IZoneDebugDto[] = list.value;
    // @ts-ignore
    _[index][key] = value;
    list.value = _;
    alt.emit('zone_editor:update_item', toDeepRaw(list.value[index]));
};

const expand = (id: number) => {
    if (id === expandedId.value) {
        expandedId.value = -1;
    } else {
        expandedId.value = id;
    }
};

onBeforeMount(() => {
    alt.on('zone_editor:toggle', onToggle);
    alt.on('zone_editor:add_apex', onAddApex);
});

onBeforeUnmount(() => {
    alt.off('zone_editor:toggle', onToggle);
    alt.off('zone_editor:add_apex', onAddApex);
});
</script>

<template>
    <div class="cont scroll scroll-vertical" v-if="isOpen">
        <ZoneEditorItem
            v-if="list"
            v-for="(item, index) in list"
            :name="item.name"
            :hash="item.hash"
            :polygon="item.polygon"
            :key="item.id + '-' + item.polygon.length"
            :id="item.id"
            :__height="item._debug_height"
            :index="index"
            :is-selected="selectedId === item.id"
            :is-expanded="expandedId === item.id"
            @select="onSelect"
            @delete="onDelete(index)"
            @highlight="onHighlight"
            @highlightApex="onHighlightApex"
            @update="(key: keyof IZoneDto, value: any) => update(index, key, value)"
            @expand="expand(item.id)"
        />
        <button @click="createTemplate" class="btn">Создать зону</button>
    </div>
</template>

<style scoped lang="scss">
.cont {
    position: absolute;
    left: 20rem;
    top: 20rem;
    width: 400rem;
    max-height: 80vh;
    background: rgba(black, 0.95);
    display: flex;
    flex-direction: column;
    gap: 8rem;
    padding: 8rem;
    overflow: auto;
}
.btn {
    position: sticky;
    bottom: 0;
}
</style>
