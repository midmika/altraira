<script setup lang="ts">
import { iconColorize, IIconsProps } from '@/icons/Icons.ts';
import { computed, ComputedRef, ref, watch } from 'vue';

const { color, size, direction } = withDefaults(
    defineProps<IIconsProps & { direction: 'top' | 'bot' | 'left' | 'right' }>(),
    {
        color: 'white',
        size: 'medium',
        direction: 'top',
    },
);

console.log('_dir', direction);

const height: ComputedRef<string> = computed<string>(() => {
    if (size === 'small') return '14rem';
    if (size === 'medium') return '16rem';
    if (size === 'large') return '20rem';
    return '14rem';
});

const rotate: ComputedRef<number> = computed<number>(() => {
    if (direction === 'top') return 90;
    if (direction === 'bot') return 270;
    if (direction === 'right') return 90;
    if (direction === 'left') return 270;
    return 0;
});
</script>

<template>
    <svg
        class="icon"
        :style="{ height, transform: 'rotate(' + rotate + 'deg)' }"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
    >
        <path
            d="M16.1795 3.26875C15.7889 2.87823 15.1558 2.87823 14.7652 3.26875L8.12078 9.91322C6.94952 11.0845 6.94916 12.9833 8.11996 14.155L14.6903 20.7304C15.0808 21.121 15.714 21.121 16.1045 20.7304C16.495 20.3399 16.495 19.7067 16.1045 19.3162L9.53246 12.7442C9.14194 12.3536 9.14194 11.7205 9.53246 11.33L16.1795 4.68297C16.57 4.29244 16.57 3.65928 16.1795 3.26875Z"
            :fill="iconColorize(color)"
        />
    </svg>
</template>

<style scoped lang="scss">
.icon {
    transition: 200ms all ease;
}
</style>
