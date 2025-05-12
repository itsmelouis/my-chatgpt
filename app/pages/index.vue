<script setup lang="ts">
const input = ref('')
const loading = ref(false)

const { model } = useLLM()

async function createChat(prompt: string) {
  input.value = prompt
  loading.value = true
  const chat = await $fetch('/api/chats', {
    method: 'POST',
    body: { input: prompt }
  })

  refreshNuxtData('chats')
  navigateTo(`/chat/${chat?.id}`)
}

function onSubmit() {
  createChat(input.value)
}

const quickChats = [
  {
    label: 'Explique-moi les tests unitaires',
    icon: 'i-heroicons-beaker'
  },
  {
    label: 'Comment faire du TDD en Vue ?',
    icon: 'i-logos-vue'
  },
  {
    label: 'Meilleures pratiques pour les tests d\'intégration',
    icon: 'i-heroicons-clipboard-document-check'
  },
  {
    label: 'Pourquoi devrais-je avoir 20 à ce projet ?',
    icon: 'i-heroicons-academic-cap'
  },
  {
    label: 'Outils pour assurer la qualité du code',
    icon: 'i-heroicons-wrench-screwdriver'
  }
]
</script>

<template>
  <DashboardPanel id="home">
    <template #body>
      <UContainer class="flex-1 flex flex-col justify-center gap-4 sm:gap-6 py-8">
        <h1 class="text-3xl sm:text-4xl text-(--ui-text-highlighted) font-bold">
          Comment puis-je vous aider aujourd'hui ?
        </h1>

        <ChatPrompt
          v-model="input"
          :status="loading ? 'streaming' : 'ready'"
          class="[view-transition-name:chat-prompt]"
          variant="subtle"
          @submit="onSubmit"
        >
          <ChatPromptSubmit color="neutral" />

          <template #footer>
            <ModelSelect v-model="model" />
          </template>
        </ChatPrompt>

        <div class="flex flex-wrap gap-2">
          <UButton
            v-for="quickChat in quickChats"
            :key="quickChat.label"
            :icon="quickChat.icon"
            :label="quickChat.label"
            size="sm"
            color="neutral"
            variant="outline"
            class="rounded-full"
            @click="createChat(quickChat.label)"
          />
        </div>
      </UContainer>
    </template>
  </DashboardPanel>
</template>
