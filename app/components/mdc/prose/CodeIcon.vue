<script setup lang="ts">
import { computed } from 'vue'

const props = defineProps({
  icon: { type: String, required: false },
  filename: { type: String, required: false }
})
const icon = computed(() => {
  if (props.icon) {
    return props.icon
  }
  if (!props.filename) {
    return
  }
  const cleanFilename = props.filename.replace(/\s*\(.*\)\s*$/, '')
  const extension = cleanFilename.includes('.') && cleanFilename.split('.').pop()
  const name = cleanFilename.split('/').pop()
  return (name && `i-vscode-icons-file-type-${extension}`) || `i-vscode-icons-file-type-${extension}` || 'i-vscode-icons-file-type-default'
})
</script>

<template>
  <UIcon v-if="icon" :name="icon" />
</template>
