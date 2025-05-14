import { test, expect } from '@playwright/test'

// Test pour la page d'accueil
test('la page d\'accueil doit se charger correctement', async ({ page }) => {
  // Naviguer vers la page d'accueil
  await page.goto('/')

  // Vérifier que le titre est présent
  await expect(page.locator('h1')).toBeVisible()

  // Vérifier qu'il y a une navigation principale
  await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible()

  // Vérifier que le bouton pour créer un nouveau chat est présent
  await expect(page.getByRole('button', { name: /nouveau chat/i })).toBeVisible()
})

// Test pour la création d'un nouveau chat
test('doit pouvoir créer un nouveau chat', async ({ page }) => {
  // Naviguer vers la page d'accueil
  await page.goto('/')

  // Cliquer sur le bouton pour créer un nouveau chat
  await page.getByRole('button', { name: /nouveau chat/i }).click()

  // Vérifier que l'URL a changé et contient "/chat/"
  await expect(page).toHaveURL(/\/chat\//)

  // Vérifier que la zone de saisie de message est visible
  await expect(page.locator('textarea, input[type="text"]')).toBeVisible()
})
