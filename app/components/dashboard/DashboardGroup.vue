<script setup>
import { ref } from 'vue'
import { Primitive } from 'reka-ui'
import { useNuxtApp } from '#imports'
import { provideDashboardContext } from '~/utils/dashboard'

const props = defineProps({
  class: { type: null, required: false },
  storage: { type: String, required: false, default: 'cookie' },
  storageKey: { type: String, required: false, default: 'dashboard' },
  persistent: { type: Boolean, required: false, default: true },
  unit: { type: String, required: false, default: '%' }
})
defineSlots()
const nuxtApp = useNuxtApp()
const sidebarOpen = ref(false)
const sidebarCollapsed = ref(false)
provideDashboardContext({
  storage: props.storage,
  storageKey: props.storageKey,
  persistent: props.persistent,
  unit: props.unit,
  sidebarOpen,
  toggleSidebar: () => {
    nuxtApp.hooks.callHook('dashboard:sidebar:toggle')
  },
  sidebarCollapsed,
  collapseSidebar: (collapsed) => {
    nuxtApp.hooks.callHook('dashboard:sidebar:collapse', collapsed)
  },
  toggleSearch: () => {
    nuxtApp.hooks.callHook('dashboard:search:toggle')
  }
})
</script>

<template>
  <Primitive as="div" class="fixed inset-0 flex overflow-hidden">
    <slot />
  </Primitive>
</template>
