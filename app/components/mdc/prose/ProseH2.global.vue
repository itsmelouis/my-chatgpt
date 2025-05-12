<script setup>
import { computed } from 'vue'
import { useRuntimeConfig } from '#imports'

const props = defineProps({
  id: { type: String, required: false },
  class: { type: null, required: false }
})

const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => props.id && typeof headings?.anchorLinks === 'object' && headings.anchorLinks.h2)
</script>

<template>
  <h2 :id="id" class="'relative text-2xl text-highlighted font-bold mt-12 mb-6 scroll-mt-[calc(48px+45px+var(--ui-header-height))] lg:scroll-mt-[calc(48px+var(--ui-header-height))] [&>a]:focus-visible:outline-primary [&>a>code]:border-dashed hover:[&>a>code]:border-primary hover:[&>a>code]:text-primary [&>a>code]:text-xl/7 [&>a>code]:font-bold [&>a>code]:transition-colors">
    <a v-if="id && generate" :href="`#${id}`" class="group lg:ps-2 lg:-ms-2">
      <span class="absolute -ms-8 top-1 opacity-0 group-hover:opacity-100 group-focus:opacity-100 p-1 bg-elevated hover:text-primary rounded-md hidden lg:flex text-muted">
        <UIcon name="i-lucide-hash" class="size-4 shrink-0" />
      </span>

      <slot />
    </a>
    <slot v-else />
  </h2>
</template>
