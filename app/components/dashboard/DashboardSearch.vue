<script setup>
import { computed, useTemplateRef } from 'vue'
import { defu } from 'defu'
import { omit } from '~/utils'
import { useColorMode, defineShortcuts, useRuntimeHook } from '#imports'

const props = defineProps({
  icon: { type: String, required: false },
  placeholder: { type: String, required: false },
  loading: { type: Boolean, required: false },
  loadingIcon: { type: String, required: false },
  shortcut: { type: String, required: false, default: 'meta_k' },
  groups: { type: Array, required: false },
  fuse: { type: Object, required: false },
  colorMode: { type: Boolean, required: false, default: true },
  class: { type: null, required: false },
  ui: { type: Object, required: false }
})
const slots = defineSlots()
const open = defineModel('open', { type: Boolean, ...{ default: false } })
const searchTerm = defineModel('searchTerm', { type: String, ...{ default: '' } })
useRuntimeHook('dashboard:search:toggle', () => {
  open.value = !open.value
})
// eslint-disable-next-line vue/no-dupe-keys
const colorMode = useColorMode()
const proxySlots = omit(slots, ['content'])
const fuse = computed(() => defu({}, props.fuse, {
  fuseOptions: {}
}))
const groups = computed(() => {
  const groups2 = []
  groups2.push(...props.groups || [])
  if (props.colorMode && !colorMode?.forced) {
    groups2.push({
      id: 'theme',
      label: 'Thème',
      items: [{
        label: 'Système',
        icon: 'i-lucide-monitor',
        active: colorMode.preference === 'system',
        onSelect: () => {
          colorMode.preference = 'system'
        }
      }, {
        label: 'Clair',
        icon: 'i-lucide-sun',
        active: colorMode.preference === 'light',
        onSelect: () => {
          colorMode.preference = 'light'
        }
      }, {
        label: 'Sombre',
        icon: 'i-lucide-moon',
        active: colorMode.preference === 'dark',
        onSelect: () => {
          colorMode.preference = 'dark'
        }
      }]
    })
  }
  return groups2
})
function onSelect(item) {
  if (item.disabled) {
    return
  }
  open.value = false
  searchTerm.value = ''
}
defineShortcuts({
  [props.shortcut]: {
    usingInput: true,
    handler: () => open.value = !open.value
  }
})
const commandPaletteRef = useTemplateRef('commandPaletteRef')
defineExpose({
  commandPaletteRef
})
</script>

<template>
  <UModal v-model:open="open" class="sm:max-w-3xl sm:h-[28rem]">
    <template #content>
      <slot name="content">
        <UCommandPalette
          ref="commandPaletteRef"
          v-model:search-term="searchTerm"
          :icon="icon"
          :placeholder="placeholder"
          :loading="loading"
          :loading-icon="loadingIcon"
          :groups="groups"
          :fuse="fuse"
          close
          @update:model-value="onSelect"
          @update:open="open = $event"
        >
          <template v-for="(_, name) in proxySlots" #[name]="slotData">
            <slot :name="name" v-bind="slotData" />
          </template>
        </UCommandPalette>
      </slot>
    </template>
  </UModal>
</template>
