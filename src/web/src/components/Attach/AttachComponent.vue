<script setup lang="ts">
import { reactive, watch} from "vue";
import DialogComponent from "../Dialog/DialogComponent.vue";
import InputBox from "@/ui/InputBox.vue";
import Range from "@/ui/Range.vue";
import TextLabel from "@/ui/text/TextLabel.vue";
import ButtonComponent from "@/ui/button/ButtonComponent.vue";
import InputCheckbox from "@/ui/input/InputCheckbox.vue";

interface IData {
  model: string,
  bone: string,
  offset: { x: number, y: number, z: number },
  rot: { x: number, y: number, z: number },
  useSoftPinning: boolean,
  collision: boolean,
  fixedRot: boolean
}

const data = reactive<IData>({
  model: "",
  bone: "",
  offset: { x: 0, y: 0, z: 0 },
  rot: { x: 0, y: 0, z: 0 },
  useSoftPinning: false,
  collision: false,
  fixedRot: false
})

// watch(data.offset, (val) => {
//   window.alt.emit('attach:offset', val)
// })
//
// watch(data.rot, (val) => {
//   window.alt.emit('attach:rot', val)
// })

watch(data, (val) => window.alt.emit('attach:create', val))

const createAttach = (): void => {
  window.alt.emit('attach:create', data)
}

const deleteAttach = (): void => {
  alt.emit('attach:delete')
}

</script>


<template>
    <DialogComponent title="Редиктирование аттача" class="attach">
      <InputBox @onChange="(val: string) => data.model = val" text="Модель"/>
      <InputBox @onChange="(val: string) => data.bone = val" text="Кость" type="number"/>
      <div class="flex gap-12">
        <ButtonComponent @click="createAttach">Создать</ButtonComponent>
        <ButtonComponent @click="deleteAttach">Удалить</ButtonComponent>
      </div>
      <div class="attach-inputs">
        <TextLabel>Position Offset</TextLabel>
        <Range @onChange="(val: number) => data.offset.x = val" title="X" :default="0" :min="-1" :max="1" :step="0.01" />
        <Range @onChange="(val: number) => data.offset.y = val" title="Y" :default="0" :min="-1" :max="1" :step="0.01" />
        <Range @onChange="(val: number) => data.offset.z = val" title="Z" :default="0" :min="-1" :max="1" :step="0.01" />
      </div>
      <div class="attach-inputs">
        <TextLabel>Rotation</TextLabel>
        <Range @onChange="(val: number) => data.rot.x = val" title="X" :default="0" :min="0" :max="360" :step="1" />
        <Range @onChange="(val: number) => data.rot.y = val" title="Y" :default="0" :min="0" :max="360" :step="1" />
        <Range @onChange="(val: number) => data.rot.z = val" title="Z" :default="0" :min="0" :max="360" :step="1" />
      </div>
      <div class="attach-inputs">
        <TextLabel>Параметры</TextLabel>
        <InputCheckbox title="Soft Pinning" @onChange="(val: boolean) => data.useSoftPinning = val"/>
        <InputCheckbox title="Collision" @onChange="(val: boolean) => data.collision = val"/>
        <InputCheckbox title="Fixed Rotation" @onChange="(val: boolean) => data.fixedRot = val"/>
      </div>
    </DialogComponent>
</template>

<style lang="scss">
.attach {
  display: flex;
  flex-direction: column;
  gap: 12rem;
  &-inputs{
    display: flex;
    flex-direction: column;
    gap: 16rem;
    padding: 12rem 0;
  }
}
</style>