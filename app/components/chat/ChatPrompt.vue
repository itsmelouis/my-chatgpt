<script setup>
import { Primitive } from 'reka-ui'
import { omit } from '~/utils'

defineOptions({ inheritAttrs: false })
const props = defineProps({
  as: { type: null, required: false, default: 'form' },
  placeholder: { type: String, required: false },
  autofocus: { type: null, required: false, default: true },
  autoresize: { type: null, required: false, default: true },
  rows: { type: null, required: false, default: 1 },
  variant: { type: null, required: false },
  error: { type: Error, required: false },
  class: { type: null, required: false }
})
const emits = defineEmits(['submit', 'close'])
const slots = defineSlots()
const model = defineModel({ type: String, ...{ default: '' } })
// const textareaProps = useForwardProps(reactivePick(props, 'autofocus', 'autoresize', 'rows'))
const proxySlots = omit(slots, ['header', 'footer'])

function submit(e) {
  if (model.value.trim() === '') {
    return
  }
  alert('submit' + model.value)
  emits('submit', e)
}
function blur(e) {
  textarea.value?.textareaRef?.blur()
  emits('close', e)
}
const textarea = useTemplateRef('textarea')
defineExpose({
  textareaRef: textarea.value?.textareaRef
})
</script>

<template>
  <Primitive
    :as="as"
    class="relative flex flex-col items-stretch gap-2 px-2.5 py-2 w-full rounded-[calc(var(--ui-radius)*2)] backdrop-blur bg-(--ui-bg-elevated)/50 ring ring-(--ui-border)"
    :class="props.class"
    @submit.prevent="submit"
  >
    <div v-if="!!slots.header" class="flex items-center gap-1.5">
      <slot name="header" />
    </div>

    <UTextarea
      ref="textarea"
      v-model="model"
      :placeholder="placeholder || 'Posez-moi une question...'"
      :disabled="Boolean(error)"
      variant="none"
      :autoresize="true"
      v-bind="{ ...$attrs }"
      class="items-start"
      @keydown.enter.exact.prevent="submit"
      @keydown.esc="blur"
    >
      <template v-for="(_, name) in proxySlots" #[name]="slotData">
        <slot :name="name" v-bind="slotData" />
      </template>
    </UTextarea>

    <div v-if="!!slots.footer" class="flex items-center justify-between gap-1.5">
      <slot name="footer" />
    </div>
  </Primitive>
</template>
