<script setup lang="ts">
import { ICharacterDto } from '@/shared/app/character/VirtualCharacter.ts';
import { onBeforeMount, onBeforeUnmount, ref, Ref } from 'vue';

const characters_list: Ref<ICharacterDto[] | null> = ref(null);

const onList = (list: ICharacterDto[]) => {
    characters_list.value = list;
};

const create = () => {
    alt.emit('login:select:create');
};

const preview = (dto: ICharacterDto) => {
    alt.emit('login:select:preview', dto);
};

const select = (dto: ICharacterDto) => {
    alt.emit('login:select:select', dto);
};

onBeforeMount(() => {
    alt.on('login:select:start', onList);
});

onBeforeUnmount(() => {
    alt.off('login:select:start', onList);
});
</script>

<template>
    <div class="login">
        <h1>Мои персонажи</h1>
        <div class="list">
            <div v-for="item in characters_list" class="list-item" @click="preview(item)">
                <span> {{ item.username }}</span>
                <button @click="select(item)">Выбрать</button>
            </div>
        </div>
        <button :style="{ marginTop: 'auto', width: '300rem' }" @click="create">Создать персонажа</button>
    </div>
</template>

<style scoped lang="scss">
.login {
    display: flex;
}
</style>
