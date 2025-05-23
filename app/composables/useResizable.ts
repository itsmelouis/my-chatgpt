import { ref, computed, unref, isRef, watch } from 'vue'
import { useStorage } from '@vueuse/core'
import type { Ref } from 'vue'
import { useCookie } from '#imports'

export type UseResizableProps = {
  /**
     * The id of the panel.
     * @defaultValue useId()
     */
  id?: string
  /**
     * The side to render the panel on.
     * @defaultValue 'left'
     */
  side?: 'left' | 'right'
  /**
     * The minimum size of the panel.
     * @defaultValue 0
     */
  minSize?: number
  /**
     * The maximum size of the panel.
     * @defaultValue 100
     */
  maxSize?: number
  /**
     * The default size of the panel.
     * @defaultValue 0
     */
  defaultSize?: number
  /**
     * Whether to allow the user to resize the panel.
     * @defaultValue true
     */
  resizable?: boolean
  /**
     * Whether to allow the user to collapse the panel.
     * @defaultValue true
     */
  collapsible?: boolean
  /**
     * The size of the panel when collapsed.
     * @defaultValue 0
     */
  collapsedSize?: number
  /**
     * The storage to use for the size.
     * @defaultValue 'cookie'
     */
  storage?: 'cookie' | 'local'
  /**
     * Unique id used to auto-save size.
     * @defaultValue 'dashboard'
     */
  storageKey?: string
  /**
     * Whether to persist the size in the storage.
     * @defaultValue true
     */
  persistent?: boolean
  /**
     * The unit to use for size values.
     * @defaultValue '%'
     */
  unit?: '%' | 'rem' | 'px'
}
type UseResizableReturn = {
  el: Ref<HTMLElement | null>
  size: Ref<number>
  isDragging: Ref<boolean>
  isCollapsed: Ref<boolean>
  onMouseDown: (e: MouseEvent) => void
  onTouchStart: (e: TouchEvent) => void
  collapse: (value?: boolean) => void
}

export const useResizable = (key: string, options?: Ref<UseResizableProps> | UseResizableProps, { collapsed = ref(false) } = {}): UseResizableReturn => {
  const el = ref<HTMLElement | null>(null)
  const opts = computed(() => ({
    side: 'left',
    minSize: 0,
    maxSize: 100,
    defaultSize: 0,
    storage: 'cookie',
    persistent: true,
    collapsible: false,
    collapsedSize: 0,
    resizable: true,
    unit: '%',
    ...isRef(options) ? options.value : options
  }))
  const defaultStorageValue = {
    size: opts.value.defaultSize,
    collapsed: unref(collapsed) ?? false
  }
  const storageData = opts.value.persistent && (opts.value.resizable || opts.value.collapsible) ? opts.value.storage === 'cookie' ? useCookie(key, { default: () => defaultStorageValue }) : useStorage(key, defaultStorageValue) : ref(defaultStorageValue)
  const isCollapsed = computed({
    get: () => storageData.value.collapsed,
    set: (value) => {
      if (!opts.value.collapsible) {
        return
      }
      if (isRef(collapsed)) {
        collapsed.value = value
      }
      storageData.value.collapsed = value
    }
  })
  const previousSize = ref(opts.value.defaultSize)
  const size = computed({
    get: () => storageData.value.size,
    set: (value) => {
      storageData.value.size = value
    }
  })
  const currentSize = computed(() => isCollapsed.value ? opts.value.collapsedSize : size.value)
  const isDragging = ref(false)
  const onMouseMove = (e: MouseEvent, initialPos: number, initialSize: number) => {
    if (!el.value || !opts.value.resizable) {
      return
    }
    const parentSize = el.value.parentElement?.offsetWidth || 1
    const delta = opts.value.side === 'left' ? e.clientX - initialPos : initialPos - e.clientX
    const newSize = initialSize + delta + 4
    let newValue
    if (opts.value.unit === 'rem') {
      const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
      newValue = newSize / rootFontSize
    } else if (opts.value.unit === 'px') {
      newValue = newSize
    } else {
      newValue = newSize / parentSize * 100
    }
    if (opts.value.collapsible && newValue < opts.value.collapsedSize + 4) {
      collapse(true)
      return
    } else if (isCollapsed.value) {
      collapse(false)
    }
    size.value = Math.min(opts.value.maxSize, Math.max(opts.value.minSize, newValue))
  }
  const onMouseDown = (e: MouseEvent) => {
    if (!el.value || !opts.value.resizable) {
      return
    }
    e.preventDefault()
    e.stopPropagation()
    const elWidth = el.value.getBoundingClientRect().width
    if (!elWidth) {
      return
    }
    const initialX = e.clientX
    const initialWidth = elWidth
    isDragging.value = true
    const handleMouseMove = (e2: MouseEvent) => {
      onMouseMove(e2, initialX, initialWidth)
    }
    const handleMouseUp = () => {
      isDragging.value = false
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }
  const onTouchMove = (e: TouchEvent, initialPos: number, initialSize: number) => {
    if (!el.value || !opts.value.resizable || !e.touches[0]) {
      return
    }
    const parentSize = el.value.parentElement?.offsetWidth || 1
    const delta = opts.value.side === 'left' ? e.touches[0].clientX - initialPos : initialPos - e.touches[0].clientX
    const newSize = initialSize + delta
    let newValue
    if (opts.value.unit === 'rem') {
      const rootFontSize = Number.parseFloat(getComputedStyle(document.documentElement).fontSize)
      newValue = newSize / rootFontSize
    } else if (opts.value.unit === 'px') {
      newValue = newSize
    } else {
      newValue = newSize / parentSize * 100
    }
    if (opts.value.collapsible && newValue < opts.value.collapsedSize + 4) {
      collapse(true)
      return
    } else if (isCollapsed.value) {
      collapse(false)
    }
    size.value = Math.min(opts.value.maxSize, Math.max(opts.value.minSize, newValue))
  }
  const onTouchStart = (e: TouchEvent) => {
    if (!el.value || !opts.value.resizable || !e.touches[0]) {
      return
    }
    e.preventDefault()
    e.stopPropagation()
    const elWidth = el.value.getBoundingClientRect().width
    if (!elWidth) {
      return
    }
    const initialX = e.touches[0].clientX
    const initialWidth = elWidth
    isDragging.value = true
    const handleTouchMove = (e2: TouchEvent) => {
      onTouchMove(e2, initialX, initialWidth)
    }
    const handleTouchEnd = () => {
      isDragging.value = false
      document.removeEventListener('touchmove', handleTouchMove)
      document.removeEventListener('touchend', handleTouchEnd)
      document.removeEventListener('touchcancel', handleTouchEnd)
    }
    document.addEventListener('touchmove', handleTouchMove, { passive: false })
    document.addEventListener('touchend', handleTouchEnd)
    document.addEventListener('touchcancel', handleTouchEnd)
  }
  const collapse = (value?: boolean) => {
    if (!opts.value.collapsible) {
      return
    }
    const newCollapsed = value ?? !isCollapsed.value
    if (newCollapsed && !isCollapsed.value) {
      previousSize.value = size.value
    } else if (!newCollapsed && isCollapsed.value) {
      size.value = previousSize.value
    }
    isCollapsed.value = newCollapsed
  }
  if (isRef(collapsed)) {
    watch(collapsed, (value) => {
      if (!opts.value.collapsible) {
        return
      }
      if (storageData.value.collapsed !== value) {
        storageData.value.collapsed = value
      }
    })
  }
  return {
    el,
    size: currentSize,
    isDragging,
    isCollapsed,
    onMouseDown,
    onTouchStart,
    collapse
  }
}
