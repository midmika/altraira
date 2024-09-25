<script setup name="ButtonComponent" lang="ts">
interface IEmits {
  (e: 'click'): void
}
const emit = defineEmits<IEmits>()
</script>

<template>
<button class="button" @click="emit('click')">
  <slot/>
</button>
</template>

<style scoped lang="scss">
.button{
  padding: 6rem 12rem;
}
</style>