<script setup>
import { computed } from 'vue'

const props = defineProps({
  status: { type: null, required: false, default: 'ready' },
  icon: { type: String, required: false },
  color: { type: null, required: false },
  variant: { type: null, required: false },
  streamingIcon: { type: String, required: false },
  streamingColor: { type: null, required: false, default: 'neutral' },
  streamingVariant: { type: null, required: false, default: 'subtle' },
  submittedIcon: { type: String, required: false },
  submittedColor: { type: null, required: false, default: 'neutral' },
  submittedVariant: { type: null, required: false, default: 'subtle' },
  errorIcon: { type: String, required: false },
  errorColor: { type: null, required: false, default: 'error' },
  errorVariant: { type: null, required: false, default: 'soft' },
  ui: { type: Object, required: false },
  class: { type: null, required: false }
})
const emits = defineEmits(['stop', 'reload'])
const slots = defineSlots()
const buttonProps = computed(() => ({
  ready: {
    icon: props.icon || 'i-lucide-arrow-up',
    color: props.color,
    variant: props.variant,
    type: 'submit'
  },
  submitted: {
    icon: props.submittedIcon || 'i-lucide-square',
    color: props.submittedColor,
    variant: props.submittedVariant,
    onClick() {
      emits('stop')
    }
  },
  streaming: {
    icon: props.streamingIcon || 'i-lucide-square',
    color: props.streamingColor,
    variant: props.streamingVariant,
    onClick() {
      emits('stop')
    }
  },
  error: {
    icon: props.errorIcon || 'i-lucide-rotate-ccw',
    color: props.errorColor,
    variant: props.errorVariant,
    onClick() {
      emits('reload')
    }
  }
})[props.status])
</script>

<template>
  <UButton
    aria-label="Envoyer"
    v-bind="buttonProps"
    :class="props.class"
  >
    <template v-for="(_, name) in slots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>
  </UButton>
</template>
