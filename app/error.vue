<script setup lang="ts">
import type { NuxtError } from '#app'

const props = defineProps<{
  error: NuxtError
}>()

const message = computed(() => props.error.message || '')
const is404 = computed(() => props.error?.statusCode === 404 || message.value.includes('404'))

useSeoMeta({
  title: 'My ChatGPT - Erreur',
  description: 'Nous sommes désolés, mais cette page n\'existe pas ou a été supprimée.'
})

useHead({
  htmlAttrs: {
    lang: 'fr'
  }
})

function handleError() {
  return clearError({ redirect: '/' })
}
</script>

<template>
  <UApp>
    <main class="min-h-[calc(100vh-var(--ui-header-height))] flex flex-col items-center justify-center text-center">
      <p class="text-base font-semibold text-(--ui-primary)">
        {{ props.error?.statusCode }}
      </p>
      <h1 class="mt-2 text-4xl sm:text-5xl font-bold text-(--ui-text-highlighted) text-balance">
        {{ is404 ? 'Page introuvable' : 'Une erreur est survenue' }}
      </h1>
      <DevOnly>
        <pre>{{ error }}</pre>
      </DevOnly>
      <div class="mt-8 flex items-center justify-center gap-6">
        <UButton
          size="lg"
          color="primary"
          variant="solid"
          label="Retour à l'accueil"
          @click="handleError"
        />
      </div>
    </main>
  </UApp>
</template>
