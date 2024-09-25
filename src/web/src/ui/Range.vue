<script setup name="Range" lang="ts">

import {computed, ComputedRef, ref} from "vue";
import NormalText from "@/components/test/NormalText.vue";

interface IProps {
  min: number,
  max: number,
  default: number,
  step: number,
  title: string
}
const props = defineProps<IProps>()

interface IEmits {
  (e: 'onChange', value: number): void
}
const emit = defineEmits<IEmits>()

const value = ref(props.default)

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const _value = Number(target.value)
  value.value = _value
  emit('onChange', _value)
}

const badgeLeftOffset: ComputedRef<number> = computed<number>(() => {
  return ((value.value - props.min) / ((props.max - props.min) || 1)) * 100
})

</script>

<template>
  <div class="range-default">
    <NormalText>{{ props.title }}</NormalText>
    <div class="range-default-wrapper">
      <input
          class="range-default__input"
          type="range"
          :min="props.min"
          :max="props.max"
          :value="value"
          :step="props.step"
          @input="onInput"
      >
      <span class="range-default__badge" :style="{ left: badgeLeftOffset + '%' }">{{ value }}</span>
    </div>
  </div>
</template>

<style scoped lang="scss">
.range-default{
  display: flex;
  gap: 6rem;
  align-items: center;
  &-wrapper{
    position: relative;
    display: flex;
    width: 100%;
  }
  &__input{
    width: 100%;
  }
  &__badge{
    position: absolute;
    font-size: 14rem;
    left: 0;
    bottom: -16rem;
    transform: translate(-50%, 0);
    width: fit-content;
  }
  &__val{

  }
}
</style>