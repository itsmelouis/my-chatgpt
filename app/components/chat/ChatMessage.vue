<script setup>
import { Primitive } from 'reka-ui'
import { omit } from '~/utils'

const props = defineProps({
  as: { type: null, required: false, default: 'article' },
  icon: { type: String, required: false },
  avatar: { type: Object, required: false },
  variant: { type: null, required: false },
  side: { type: null, required: false },
  actions: { type: Array, required: false },
  compact: { type: Boolean, required: false },
  class: { type: null, required: false },
  ui: { type: Object, required: false },
  id: { type: String, required: true },
  createdAt: { type: Date, required: false },
  content: { type: String, required: true },
  reasoning: { type: String, required: false },
  experimental_attachments: { type: Array, required: false },
  role: { type: String, required: true },
  data: { type: [null, String, Number, Boolean, Object, Array], required: false },
  annotations: { type: null, required: false },
  toolInvocations: { type: Array, required: false },
  parts: { type: Array, required: false }
})
const slots = defineSlots()
</script>

<template>
  <Primitive :as="as" :data-role="role" class="group/message relative w-full scroll-mt-4 sm:scroll-mt-6">
    <div class="relative flex items-start group-data-[role=user]/message:max-w-[75%] group-data-[role=user]/message:ltr:justify-end group-data-[role=assistant]/message:rtl:justify-end ms-auto gap-3 pb-8">
      <div v-if="icon || avatar || !!slots.leading" class="inline-flex items-center justify-center min-h-6">
        <slot name="leading" :avatar="avatar">
          <UIcon v-if="icon" :name="icon" class="shrink-0" />
          <UAvatar
            v-else-if="avatar"
            v-bind="avatar"
            class="shrink-0"
          />
        </slot>
      </div>

      <div
        v-if="content || !!slots.content"
        class="relative text-pretty"
        :class="role === 'user' ? 'bg-neutral-100/50 dark:bg-neutral-800 px-4 py-3 rounded-lg min-h-12' : ''"
      >
        <slot name="content" :content="content">
          {{ content }}
        </slot>
      </div>

      <div v-if="actions || !!slots.actions" class="opacity-0 group-hover/message:opacity-100 absolute bottom-0 flex items-center transition-opacity">
        <slot name="actions" :actions="actions">
          <UTooltip v-for="(action, index) in actions" :key="index" :text="action.label">
            <UButton
              size="sm"
              color="neutral"
              variant="ghost"
              v-bind="omit(action, ['onClick'])"
              :label="undefined"
              @click="typeof action.onClick === 'function' ? action.onClick($event, props) : void 0"
            />
          </UTooltip>
        </slot>
      </div>
    </div>
  </Primitive>
</template>
