<script setup lang="ts">
import { nextTick, onBeforeMount, onBeforeUnmount, onMounted, Ref, ref } from 'vue';

const isOpen = ref(false);
const string = ref();
const input: Ref = ref(null);

const onSubmit = () => {
    alt.emit('command', input.value.value);
    input.value.value = '';
};

const onWindowFocus = () => {
    input.value?.focus();
};

const onWindowBlue = () => {
    input.value?.blur();
};

const onOpenConsole = () => {
    isOpen.value = true;
    nextTick(() => {
        input.value?.focus();
    });
};

const onCloseConsole = () => {
    isOpen.value = false;
};

onMounted(() => {
    input.value?.focus();
});

onBeforeMount(() => {
    addEventListener('focus', onWindowFocus);
    alt.on('console:open', onOpenConsole);
    alt.on('console:close', onCloseConsole);
});

onBeforeUnmount(() => {
    removeEventListener('focus', onWindowFocus);
    alt.off('console:open', onOpenConsole);
    alt.off('console:close', onCloseConsole);
});
</script>

<template>
    <Transition>
        <div class="commandline" v-if="isOpen">
            <input
                class="commandline__input"
                @focus="onMounted"
                ref="input"
                type="text"
                :value="string"
                @keydown.enter="onSubmit"
            />
        </div>
    </Transition>
</template>

<style lang="scss" scoped>
.commandline {
    min-width: min(40vw, 200px);
    width: auto;
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    &__input {
        width: auto;
        text-align: center;
        font-size: 34px;
        border: none;
        padding: 10px 0;
        border-bottom: 1px solid white;
        height: 100%;
        background: transparent;
        outline: none;
        color: white;
    }
}
</style>
