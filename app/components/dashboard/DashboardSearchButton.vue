<script setup>
import { useForwardProps } from 'reka-ui'
import { reactivePick } from '@vueuse/core'
import { useDashboard } from '~/utils/dashboard'
import { omit } from '~/utils'
import { useAppConfig } from '#imports'

const props = defineProps({
  icon: { type: String, required: false },
  label: { type: String, required: false },
  color: { type: null, required: false, default: 'neutral' },
  variant: { type: null, required: false },
  size: { type: null, required: false },
  collapsed: { type: Boolean, required: false, default: false },
  kbds: { type: Array, required: false, default: () => ['meta', 'k'] },
  ui: { type: Object, required: false },
  class: { type: null, required: false }
})
const slots = defineSlots()
const proxySlots = omit(slots, ['trailing'])
const rootProps = useForwardProps(reactivePick(props, 'color', 'size'))
const appConfig = useAppConfig()
const { toggleSearch } = useDashboard({ toggleSearch: () => {
} })
</script>

<template>
  <UButton
    :icon="icon || appConfig.ui.icons.search"
    :variant="(collapsed ? 'ghost' : 'outline')"
    v-bind="{
      ...rootProps,
      ...collapsed ? {
        'square': true,
        'aria-label': label || 'Rechercher'
      } : {}
    }"
    class=""
    @click="toggleSearch"
  >
    <template v-for="(_, name) in proxySlots" #[name]="slotData">
      <slot :name="name" v-bind="slotData" />
    </template>

    <template v-if="!collapsed" #trailing>
      <div class="hidden lg:flex items-center gap-0.5 ms-auto">
        <slot name="trailing">
          <template v-if="kbds?.length">
            <UKbd
              v-for="(kbd, index) in kbds"
              :key="index"
              variant="subtle"
              v-bind="typeof kbd === 'string' ? { value: kbd } : kbd"
            />
          </template>
        </slot>
      </div>
    </template>
  </UButton>
</template>
