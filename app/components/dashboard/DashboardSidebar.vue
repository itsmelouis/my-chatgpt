<script setup>
import { ref, computed, toRef, useId, watch } from 'vue'
import { defu } from 'defu'
import { createReusableTemplate } from '@vueuse/core'
import { useResizable } from '~/composables/useResizable'
import { useDashboard } from '~/utils/dashboard'
import { useRuntimeHook } from '#imports'
import { USlideover, UModal, UDrawer } from '#components'

const props = defineProps({
  mode: { type: null, required: false, default: 'slideover' },
  menu: { type: null, required: false },
  toggle: { type: [Boolean, Object], required: false, default: true },
  toggleSide: { type: String, required: false, default: 'left' },
  class: { type: null, required: false },
  id: { type: String, required: false },
  side: { type: String, required: false, default: 'left' },
  minSize: { type: Number, required: false, default: 10 },
  maxSize: { type: Number, required: false, default: 20 },
  defaultSize: { type: Number, required: false, default: 15 },
  resizable: { type: Boolean, required: false, default: false },
  collapsible: { type: Boolean, required: false, default: false },
  collapsedSize: { type: Number, required: false, default: 0 }
})

const slots = defineSlots()
const open = defineModel('open', { type: Boolean, ...{ default: false } })
const collapsed = defineModel('collapsed', { type: Boolean, ...{ default: false } })
const dashboardContext = useDashboard({
  storageKey: 'dashboard',
  unit: '%',
  sidebarOpen: ref(false),
  sidebarCollapsed: ref(false)
})
const id = `${dashboardContext.storageKey}-sidebar-${props.id || useId()}`
const { el, size, collapse, isCollapsed, isDragging, onMouseDown, onTouchStart } = useResizable(id, toRef(() => ({ ...dashboardContext, ...props })), { collapsed })
const [DefineToggleTemplate, ReuseToggleTemplate] = createReusableTemplate()
const [DefineResizeHandleTemplate, ReuseResizeHandleTemplate] = createReusableTemplate()
useRuntimeHook('dashboard:sidebar:toggle', () => {
  open.value = !open.value
})
useRuntimeHook('dashboard:sidebar:collapse', (value) => {
  isCollapsed.value = value
})
watch(open, () => dashboardContext.sidebarOpen.value = open.value, { immediate: true })
watch(isCollapsed, () => dashboardContext.sidebarCollapsed.value = isCollapsed.value, { immediate: true })
const Menu = computed(() => ({
  slideover: USlideover,
  modal: UModal,
  drawer: UDrawer
})[props.mode])
const menuProps = toRef(() => defu(props.menu, {
  content: {
    onOpenAutoFocus: e => e.preventDefault()
  }
}, props.mode === 'modal' ? { fullscreen: true, transition: false } : props.mode === 'slideover' ? { side: 'left' } : {}))
</script>

<template>
  <DefineToggleTemplate>
    <slot name="toggle" :open="open" :toggle="toggle">
      <DashboardSidebarToggle
        v-if="toggle"
        v-bind="typeof toggle === 'object' ? toggle : {}"
        :side="toggleSide"
      />
    </slot>
  </DefineToggleTemplate>

  <DefineResizeHandleTemplate>
    <slot name="resize-handle" :on-mouse-down="onMouseDown" :on-touch-start="onTouchStart" />
  </DefineResizeHandleTemplate>

  <ReuseResizeHandleTemplate v-if="side === 'right'" />

  <div
    :id="id"
    ref="el"
    :data-collapsed="isCollapsed"
    :data-dragging="isDragging"
    class="relative hidden lg:flex flex-col min-h-svh min-w-16 w-(--width) shrink-0 border-r border-(--ui-border)"
    :class="props.class"
    :style="{ '--width': `${size || 0}${dashboardContext.unit}` }"
  >
    <div v-if="!!slots.header" class="h-(--ui-header-height) shrink-0 flex items-center gap-1.5 px-4">
      <slot name="header" :collapsed="isCollapsed" :collapse="collapse" />
    </div>

    <div class="flex flex-col gap-4 flex-1 overflow-y-auto px-4 py-2">
      <slot :collapsed="isCollapsed" :collapse="collapse" />
    </div>

    <div v-if="!!slots.footer" class="shrink-0 flex items-center gap-1.5 px-4 py-2">
      <slot name="footer" :collapsed="isCollapsed" :collapse="collapse" />
    </div>
  </div>

  <ReuseResizeHandleTemplate v-if="side === 'left'" />

  <Menu
    v-model:open="open"
    v-bind="menuProps"
    :ui="{
      overlay: 'lg:hidden',
      content: 'lg:hidden'
    }"
  >
    <template #content>
      <slot name="content">
        <div v-if="!!slots.header || mode !== 'drawer'" class="h-(--ui-header-height) shrink-0 flex flex-col items-center gap-1.5 px-4 sm:px-6">
          <ReuseToggleTemplate v-if="mode !== 'drawer' && toggleSide === 'left'" />

          <slot name="header" />

          <ReuseToggleTemplate v-if="mode !== 'drawer' && toggleSide === 'right'" />
        </div>

        <div class="flex flex-col gap-4 flex-1 overflow-y-auto px-4 py-2 sm:px-6">
          <slot />
        </div>

        <div v-if="!!slots.footer" class="shrink-0 flex items-center gap-1.5 px-4 py-2 sm:px-6">
          <slot name="footer" />
        </div>
      </slot>
    </template>
  </Menu>
</template>
