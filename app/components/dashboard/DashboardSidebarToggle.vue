<script setup>
import { ref } from 'vue'
import { useForwardProps } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useDashboard } from '~/utils/dashboard'
import { useAppConfig } from '#imports'

const props = defineProps({
  side: { type: String, required: false, default: 'left' },
  color: { type: null, required: false, default: 'neutral' },
  variant: { type: null, required: false, default: 'ghost' },
  class: { type: null, required: false }
})
const rootProps = useForwardProps(reactivePick(props, 'color', 'variant', 'size'))
const appConfig = useAppConfig()
const { sidebarOpen, toggleSidebar } = useDashboard({ sidebarOpen: ref(false), toggleSidebar: () => {
} })
</script>

<template>
  <UButton
    v-bind="rootProps"
    :aria-label="sidebarOpen ? 'Fermer' : 'Ouvrir'"
    :icon="sidebarOpen ? appConfig.ui.icons.close : appConfig.ui.icons.menu"
    @click="toggleSidebar"
  />
</template>
