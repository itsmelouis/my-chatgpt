<script setup>
import { computed } from 'vue'
import { useRuntimeConfig } from '#imports'

const props = defineProps({
  id: { type: String, required: false },
  class: { type: null, required: false }
})
const { headings } = useRuntimeConfig().public.mdc

const generate = computed(() => props.id && typeof headings?.anchorLinks === 'object' && headings.anchorLinks.h1)
</script>

<template>
  <h1 :id="id" class="text-4xl text-highlighted font-bold mb-8 scroll-mt-[calc(45px+var(--ui-header-height))] lg:scroll-mt-(--ui-header-height)">
    <a v-if="id && generate" :href="`#${id}`" class="inline-flex items-center gap-2">
      <slot />
    </a>
    <slot v-else />
  </h1>
</template>
