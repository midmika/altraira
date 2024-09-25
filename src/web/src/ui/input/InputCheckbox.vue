<script setup lang="ts">
import {ref} from "vue";
import NormalText from "@/components/test/NormalText.vue";

interface IEmits {
  (e: 'onChange', val: boolean): void
}
const emit = defineEmits<IEmits>()

interface IProps {
  title: string,
  default?: boolean
}
const props = defineProps<IProps>()

const value = ref<boolean>(props.default)

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('onChange', target.checked)
}

</script>

<template>
  <div class="flex g-6 align-center">
    <NormalText>{{ props.title }}</NormalText>
    <input type="checkbox" :checked="value" @input="onInput">
  </div>
</template>

<style scoped lang="scss">
</style>