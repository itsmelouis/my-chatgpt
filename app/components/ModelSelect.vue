<script setup lang="ts">
const { model, models } = useLLM()
</script>

<template>
  <USelectMenu
    v-model="model"
    :items="models"
    variant="ghost"
    :search-input="{
      placeholder: 'Rechercher un modèle...',
      icon: 'i-lucide-search'
    }"
    class="hover:bg-(--ui-bg) focus:bg-(--ui-bg) data-[state=open]:bg-(--ui-bg) min-w-3xs"
    :ui="{
      trailingIcon: 'group-data-[state=open]:rotate-180 transition-transform duration-200'
    }"
  />
</template>
