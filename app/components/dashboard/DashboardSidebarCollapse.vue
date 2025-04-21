<script setup>
import { ref } from 'vue'
import { useForwardProps } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useDashboard } from '~/utils/dashboard'

const props = defineProps({
  side: { type: String, required: false, default: 'left' },
  color: { type: null, required: false, default: 'neutral' },
  variant: { type: null, required: false, default: 'ghost' },
  class: { type: null, required: false }
})
const rootProps = useForwardProps(reactivePick(props, 'color', 'variant', 'size'))
const { sidebarCollapsed, collapseSidebar } = useDashboard({ sidebarCollapsed: ref(false), collapseSidebar: () => {
} })
</script>

<template>
  <UButton
    v-bind="rootProps"
    :aria-label="sidebarCollapsed ? 'Ouvrir' : 'Fermer'"
    :icon="sidebarCollapsed ? 'i-lucide-panel-left-open' : 'i-lucide-panel-left-close'"
    @click="collapseSidebar?.(!sidebarCollapsed)"
  />
</template>
