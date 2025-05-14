import { test, expect } from '@playwright/test'

// Test pour la page de chat
test('la page de chat doit se charger correctement', async ({ page }) => {
  // Naviguer vers une page de chat spécifique (on utilise un ID fictif)
  await page.goto('/chat/test-chat-id')

  // Vérifier que l'interface de chat est visible
  await expect(page.locator('.chat-container, .messages-container')).toBeVisible()

  // Vérifier que la zone de saisie de message est présente
  await expect(page.locator('textarea, input[type="text"]')).toBeVisible()

  // Vérifier que le bouton d'envoi est présent
  await expect(page.getByRole('button', { name: /envoyer|send/i })).toBeVisible()
})

// Test pour l'envoi d'un message
test('doit pouvoir envoyer un message', async ({ page }) => {
  // Naviguer vers une page de chat spécifique
  await page.goto('/chat/test-chat-id')

  // Trouver la zone de saisie et taper un message
  const inputField = page.locator('textarea, input[type="text"]').first()
  await inputField.fill('Bonjour, ceci est un message de test')

  // Cliquer sur le bouton d'envoi
  await page.getByRole('button', { name: /envoyer|send/i }).click()

  // Vérifier que le message apparaît dans la conversation
  await expect(page.locator('.message, .user-message').filter({ hasText: 'Bonjour, ceci est un message de test' })).toBeVisible()

  // Vérifier qu'une réponse est générée (peut prendre du temps)
  await expect(page.locator('.message, .assistant-message')).toBeVisible({ timeout: 10000 })
})

// Test pour la modification du titre du chat
test('doit pouvoir modifier le titre du chat', async ({ page }) => {
  // Naviguer vers une page de chat spécifique
  await page.goto('/chat/test-chat-id')

  // Cliquer sur le titre ou le bouton d'édition du titre
  await page.locator('.chat-title, .edit-title-button').first().click()

  // Saisir un nouveau titre
  await page.locator('input[type="text"]').fill('Nouveau titre de chat')

  // Confirmer la modification
  await page.keyboard.press('Enter')

  // Vérifier que le titre a été mis à jour
  await expect(page.locator('.chat-title')).toContainText('Nouveau titre de chat')
})
