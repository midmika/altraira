<script setup lang="ts">
import { onBeforeMount, onBeforeUnmount, Ref, ref, watch } from 'vue';

const error: Ref<string> = ref('');
const isLoading: Ref<boolean> = ref(false);
const value: Ref<string> = ref('');

const onError = (_error: string) => {
    error.value = _error;
    isLoading.value = false;
};

const submit = () => {
    isLoading.value = true;
    alt.emit('login:creation:create', value.value);
};

watch(value, () => {
    error.value = '';
});

onBeforeMount(() => {
    alt.on('login:creation:nickname_error', onError);
});

onBeforeUnmount(() => {
    alt.off('login:creation:nickname_error', onError);
});
</script>

<template>
    <div class="cont">
        <span class="error">{{ error }}</span>
        <input v-model="value" type="text" :class="[error && 'errorinput']" placeholder="Введите никнейм" />
        <button @click="submit">Создать персонажа</button>
    </div>
</template>

<style scoped lang="scss">
.cont {
    display: flex;
    flex-direction: column;
    padding: 8rem;
    gap: 8rem;
    width: fit-content;
    input {
        background: transparent;
        color: white;
        font-size: 16rem;
        outline: none;
        padding: 8rem 16rem;
        border: 1px solid white;
        transition: 200ms all ease;
    }
}
.errorinput {
    border: 1px solid red !important;
}
.error {
    color: red;
    text-align: center;
    font-size: 14rem;
    height: 14rem;
}
</style>
