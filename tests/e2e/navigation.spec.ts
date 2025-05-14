import { test, expect } from '@playwright/test'

// Test pour la navigation entre les pages
test('doit pouvoir naviguer entre la page d\'accueil et les chats', async ({ page }) => {
  // Commencer par la page d'accueil
  await page.goto('/')

  // Créer un nouveau chat
  await page.getByRole('button', { name: /nouveau chat/i }).click()

  // Vérifier qu'on est sur une page de chat
  await expect(page).toHaveURL(/\/chat\//)

  // Revenir à la page d'accueil (en cliquant sur un bouton ou un lien)
  await page.getByRole('link', { name: /accueil|home/i }).click()

  // Vérifier qu'on est de retour sur la page d'accueil
  await expect(page).toHaveURL('/')
})

// Test pour le thème sombre/clair
test('doit pouvoir changer de thème', async ({ page }) => {
  // Aller sur la page d'accueil
  await page.goto('/')

  // Trouver et cliquer sur le bouton de changement de thème
  await page.getByRole('button', { name: /thème|theme|mode/i }).click()

  // Vérifier que le thème a changé (en vérifiant une classe CSS ou un attribut)
  await expect(page.locator('html')).toHaveAttribute('class', /dark|light/)
})

// Test pour la persistance des sessions
test('doit maintenir la session utilisateur entre les navigations', async ({ page }) => {
  // Aller sur la page d'accueil
  await page.goto('/')

  // Créer un nouveau chat
  await page.getByRole('button', { name: /nouveau chat/i }).click()

  // Envoyer un message
  const inputField = page.locator('textarea, input[type="text"]').first()
  await inputField.fill('Message test pour vérifier la persistance')
  await page.getByRole('button', { name: /envoyer|send/i }).click()

  // Attendre que le message apparaisse
  await expect(page.locator('.message, .user-message').filter({ hasText: 'Message test pour vérifier la persistance' })).toBeVisible()

  // Récupérer l'URL actuelle pour pouvoir y revenir
  const chatUrl = page.url()

  // Aller sur la page d'accueil
  await page.goto('/')

  // Revenir à la page de chat
  await page.goto(chatUrl)

  // Vérifier que le message est toujours visible (session persistante)
  await expect(page.locator('.message, .user-message').filter({ hasText: 'Message test pour vérifier la persistance' })).toBeVisible()
})
