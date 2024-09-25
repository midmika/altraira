<script setup lang="ts">
import NormalText from "@/components/test/NormalText.vue";
import {ref} from "vue";

interface IProps {
  type: 'text' | 'number',
  text: string
}

interface IEmits {
  (e: 'onChange', value: string): void
}

const { type, text } = withDefaults(defineProps<IProps>(), {
  type: 'text'
})

const emit = defineEmits<IEmits>()


const value = ref("")

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement;
  emit('onChange', target.value)
}

</script>

<template>
  <div class="inputbox">
    <NormalText>{{ text }}</NormalText>
    <input
      :value="value"
      class="inputbox__input"
      :type="type"
      @input="onInput"
    >
  </div>
</template>

<style scoped lang="scss">
.inputbox{
  display: flex;
  gap: 12rem;
  align-items: center;
  &__input{
    border: none;
    border-bottom: 1rem solid white;
    background-color: transparent;
    color: white;
    width: 100%;
    &:focus{
      outline: none;
    }
  }
}

</style>