<script setup>
import { useRuntimeConfig } from '#imports'

const props = defineProps({
  id: { type: String, required: false },
  class: { type: null, required: false }
})
const { headings } = useRuntimeConfig().public.mdc
const generate = computed(() => props.id && typeof headings?.anchorLinks === 'object' && headings.anchorLinks.h3)
</script>

<template>
  <h3 :id="id" class="relative text-xl text-highlighted font-bold mt-8 mb-3 scroll-mt-[calc(32px+45px+var(--ui-header-height))] lg:scroll-mt-[calc(32px+var(--ui-header-height))] [&>a]:focus-visible:outline-primary [&>a>code]:border-dashed hover:[&>a>code]:border-primary hover:[&>a>code]:text-primary [&>a>code]:text-lg/6 [&>a>code]:font-bold [&>a>code]:transition-colors">
    <a v-if="id && generate" :href="`#${id}`" class="group lg:ps-2 lg:-ms-2">
      <span class="absolute -ms-8 top-0.5 opacity-0 group-hover:opacity-100 group-focus:opacity-100 p-1 bg-elevated hover:text-primary rounded-md hidden lg:flex text-muted transition">
        <UIcon name="i-lucide-hash" class="size-4 shrink-0" />
      </span>

      <slot />
    </a>
    <slot v-else />
  </h3>
</template>
