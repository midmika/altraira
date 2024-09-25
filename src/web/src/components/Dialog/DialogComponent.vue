<script setup lang="ts">

import {onBeforeMount, onMounted, ref} from "vue";
import NormalText from "@/components/test/NormalText.vue";
import IconClose from "@/icons/IconClose.vue";
interface IProps {
  title: string,
  class?: string
}

const props = withDefaults(defineProps<IProps>(), {
  class: ""
})

const absoluteElement = ref<HTMLElement | null>(null);
const position = ref({ x: 0, y: 0 });
const dragging = ref(false);
const offset = ref({ x: 0, y: 0 });

const startDrag = (e: MouseEvent) => {
  dragging.value = true;
  offset.value = {
    x: e.clientX - position.value.x,
    y: e.clientY - position.value.y,
  };
};

const endDrag = () => {
  dragging.value = false;
};

const drag = (e: MouseEvent) => {
  if (dragging.value && absoluteElement.value) {
    const newX = e.clientX - offset.value.x;
    const newY = e.clientY - offset.value.y;

    // Ограничиваем перемещение элемента в пределах экрана
    const maxX = window.innerWidth - absoluteElement.value.offsetWidth;
    const maxY = window.innerHeight - absoluteElement.value.offsetHeight;

    position.value = {
      x: Math.min(Math.max(newX, 0), maxX),
      y: Math.min(Math.max(newY, 0), maxY),
    };
  }
};

onMounted(() => {
  if (absoluteElement.value) {
    position.value = {
      x: absoluteElement.value.offsetLeft,
      y: absoluteElement.value.offsetTop,
    };
  }
});

</script>

<template>
  <Teleport to="body">
    <div
        ref="absoluteElement"
        class="dialog"
        :style="{
          left: position.x + 'px',
          top: position.y + 'px'
        }"
    >
      <div
          class="dialog-head"
          @mousedown="startDrag"
          @mouseup="endDrag"
          @mousemove="drag"
      >
        <NormalText>{{ props.title }}</NormalText>
        <IconClose cursor="pointer"/>
      </div>
      <div
          class="dialog-body"
          :class="props.class"
      >
        <slot/>
      </div>
    </div>
  </Teleport>
</template>

<style scoped lang="scss">
.dialog{
  position: absolute;
  padding: 12rem 16rem;
  background: rgba(29, 17, 30, 0.89);
  border-radius: 12rem;
  min-width: 230rem;
  color: white;
  &-head{
    display: flex;
    gap: 12rem;
    cursor: pointer;
    position: relative;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6rem;
  }
}
</style>