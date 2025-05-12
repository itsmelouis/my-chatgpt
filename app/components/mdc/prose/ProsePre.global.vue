<script setup lang="ts">
import { ref } from 'vue'
import { useClipboard } from '@vueuse/core'
import CodeIcon from './CodeIcon.vue'

const props = defineProps({
  icon: { type: String, required: false },
  code: { type: String, required: false },
  language: { type: String, required: false },
  filename: { type: String, required: false },
  highlights: { type: Array, required: false },
  hideHeader: { type: Boolean, required: false },
  meta: { type: String, required: false },
  class: { type: null, required: false }
})
const clipboard = useClipboard()
const copied = ref(false)
function copy() {
  clipboard.copy(props.code || '')
  copied.value = true
  setTimeout(() => {
    copied.value = false
  }, 2e3)
}
</script>

<template>
  <div class="relative my-5 group" :class="!!filename ? '[&>pre]:rounded-t-none [&>pre]:my-0 my-5' : ''">
    <div v-if="filename && !hideHeader" class="flex items-center gap-1.5 border border-(--ui-border-muted) bg-(--ui-bg) border-b-0 relative rounded-t-[calc(var(--ui-radius)*1.5)] px-4 py-3">
      <CodeIcon :icon="icon" :filename="filename" class="size-4 shrink-0" />

      <span class="text-(--ui-text) text-sm/6">{{ filename }}</span>
    </div>

    <UButton
      :icon="copied ? 'i-lucide-copy-check' : 'i-lucide-copy'"
      color="neutral"
      variant="outline"
      size="sm"
      aria-label="Copier le code"
      class="absolute top-[11px] right-[11px] lg:opacity-0 lg:group-hover:opacity-100 transition"
      tabindex="-1"
      @click="copy"
    />

    <pre class="group font-mono text-sm/6 border border-(--ui-border-muted) bg-(--ui-bg-muted) rounded-[calc(var(--ui-radius)*1.5)] px-4 py-3 whitespace-pre-wrap break-words overflow-x-auto focus:outline-none" v-bind="$attrs"><slot /></pre>
  </div>
</template>

<style>
.shiki span.line {
  display: block;
}

.shiki span.line.highlight {
  margin: 0 -16px;
  padding: 0 16px;
  @apply bg-(--ui-bg-accented)/50;
}

span.line span {
  color: var(--shiki-default);
}
</style>
