<script setup lang="ts">
import { useChat, type Message } from '@ai-sdk/vue'
import { useClipboard } from '@vueuse/core'

const route = useRoute()
const toast = useToast()
const clipboard = useClipboard()
const { model } = useLLM()

const { data: chat } = await useFetch(`/api/chats/${route.params.id}`, {
  key: `chats/${route.params.id}`,
  getCachedData(key, nuxtApp) {
    return nuxtApp.payload.data[key]
  }
})
if (!chat.value) {
  throw createError({ statusCode: 404, statusMessage: 'Chat not found' })
}

const { messages, input, handleSubmit, reload, stop, status, error } = useChat({
  id: chat.value.id,
  api: `/api/chats/${chat.value.id}`,
  initialMessages: chat.value.messages.map(message => ({
    id: message.id,
    content: message.content,
    role: message.role
  })),
  body: {
    model: model.value
  },
  onResponse(response) {
    if (response.headers.get('X-Chat-Title')) {
      refreshNuxtData('chats')
    }
    // Clear the cache to fetch all messages next time we go on this chat
    clearNuxtData(`chats/${route.params.id}`)
  },
  onError(error) {
    const { message } = typeof error.message === 'string' && error.message[0] === '{' ? JSON.parse(error.message) : error
    toast.add({
      description: message,
      icon: 'i-lucide-alert-circle',
      color: 'error',
      duration: 0
    })
  }
})

const copied = ref(false)

function copy(e: MouseEvent, message: Message) {
  clipboard.copy(message.content)

  toast.add({
    description: 'Message copié dans le presse-papier',
    icon: 'i-lucide-copy',
    color: 'success'
  })

  copied.value = true

  setTimeout(() => {
    copied.value = false
  }, 2000)
}

onMounted(() => {
  if (chat.value?.messages.length === 1) {
    reload()
  }
})
</script>

<template>
  <DashboardPanel id="chat" class="relative">
    <template #body>
      <UContainer class="flex-1 flex flex-col gap-4 sm:gap-6">
        <ChatMessages
          :messages="messages"
          :status="status"
          :assistant="{ actions: [{ label: 'Copier', icon: copied ? 'i-lucide-copy-check' : 'i-lucide-copy', onClick: copy }] }"
          class="lg:pt-(--ui-header-height) pb-4 sm:pb-6"
          :spacing-offset="160"
        >
          <template #content="{ message }">
            <MDC :value="message.content" :cache-key="message.id" unwrap="p" />
          </template>
        </ChatMessages>

        <ChatPrompt
          v-model="input"
          :error="error"
          variant="subtle"
          class="sticky bottom-0 [view-transition-name:chat-prompt] rounded-b-none z-10"
          @submit="handleSubmit"
        >
          <ChatPromptSubmit
            :status="status"
            color="neutral"
            @stop="stop"
            @reload="reload"
          />

          <template #footer>
            <ModelSelect v-model="model" />
          </template>
        </ChatPrompt>
      </UContainer>
    </template>
  </DashboardPanel>
</template>
