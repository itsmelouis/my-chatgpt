<script setup>
import { useDashboard } from '~/utils/dashboard'
import { useResizable } from '~/composables/useResizable'

const props = defineProps({
  class: { type: null, required: false },
  id: { type: String, required: false },
  minSize: { type: Number, required: false, default: 15 },
  maxSize: { type: Number, required: false },
  defaultSize: { type: Number, required: false },
  resizable: { type: Boolean, required: false, default: false }
})
defineSlots()
const dashboardContext = useDashboard({ storageKey: 'dashboard', unit: '%' })
const id = `${dashboardContext.storageKey}-panel-${props.id || useId()}`
const { el, size, isDragging, onMouseDown, onTouchStart } = useResizable(id, toRef(() => ({ ...dashboardContext, ...props })))
</script>

<template>
  <div
    :id="id"
    ref="el"
    :data-dragging="isDragging"
    class="relative flex flex-col min-w-0 min-h-svh lg:not-last:border-r lg:not-last:border-(--ui-border) shrink-0 flex-1"
    :class="props.class"
    :style="[size ? { '--width': `${size}${dashboardContext.unit}` } : void 0]"
  >
    <slot>
      <slot name="header" />

      <div class="flex flex-col gap-4 sm:gap-6 flex-1 overflow-y-auto p-0 sm:p-0">
        <slot name="body" />
      </div>

      <slot name="footer" />
    </slot>
  </div>

  <slot name="resize-handle" :on-mouse-down="onMouseDown" :on-touch-start="onTouchStart">
    <!-- <UDashboardResizeHandle
      v-if="resizable"
      :aria-controls="id"
      :class="ui.handle({ class: props.ui?.handle })"
      @mousedown="onMouseDown"
      @touchstart="onTouchStart"
    /> -->
  </slot>
</template>
