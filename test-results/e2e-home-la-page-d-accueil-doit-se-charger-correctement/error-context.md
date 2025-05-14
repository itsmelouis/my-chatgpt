# Test info

- Name: la page d'accueil doit se charger correctement
- Location: /Users/louis/dev/school/my-chatgpt/tests/e2e/home.spec.ts:4:1

# Error details

```
Error: Timed out 5000ms waiting for expect(locator).toBeVisible()

Locator: getByRole('navigation', { name: 'Main' })
Expected: visible
Received: hidden
Call log:
  - expect.toBeVisible with timeout 5000ms
  - waiting for getByRole('navigation', { name: 'Main' })
    9 × locator resolved to <nav dir="ltr" aria-label="Main" data-collapsed="false" data-orientation="vertical" data-reka-navigation-menu="" class="relative flex gap-1.5 [&>div]:min-w-0 flex-col">…</nav>
      - unexpected value "hidden"

    at /Users/louis/dev/school/my-chatgpt/tests/e2e/home.spec.ts:12:64
```

# Page snapshot

```yaml
- link "Chat":
  - /url: /
  - img
  - text: Chat
- button "Rechercher"
- button "Fermer"
- link "Nouveau chat":
  - /url: /
- navigation "Main"
- button "Se connecter avec GitHub"
- heading "Comment puis-je vous aider aujourd'hui ?" [level=1]
- textbox "Posez-moi une question..."
- button "Envoyer"
- button "Show popup": gemini-1.5-pro
- button "Explique-moi les tests unitaires"
- button "Comment faire du TDD en Vue ?"
- button "Meilleures pratiques pour les tests d'intégration"
- button "Pourquoi devrais-je avoir 20 à ce projet ?"
- button "Outils pour assurer la qualité du code"
- img
- button "Toggle Nuxt DevTools":
  - img
- text: 196 ms
- button "Toggle Component Inspector":
  - img
- region "Notifications (F8)":
  - list
```

# Test source

```ts
   1 | import { test, expect } from '@playwright/test'
   2 |
   3 | // Test pour la page d'accueil
   4 | test('la page d\'accueil doit se charger correctement', async ({ page }) => {
   5 |   // Naviguer vers la page d'accueil
   6 |   await page.goto('/')
   7 |
   8 |   // Vérifier que le titre est présent
   9 |   await expect(page.locator('h1')).toBeVisible()
  10 |
  11 |   // Vérifier qu'il y a une navigation principale
> 12 |   await expect(page.getByRole('navigation', { name: 'Main' })).toBeVisible()
     |                                                                ^ Error: Timed out 5000ms waiting for expect(locator).toBeVisible()
  13 |
  14 |   // Vérifier que le bouton pour créer un nouveau chat est présent
  15 |   await expect(page.getByRole('button', { name: /nouveau chat/i })).toBeVisible()
  16 | })
  17 |
  18 | // Test pour la création d'un nouveau chat
  19 | test('doit pouvoir créer un nouveau chat', async ({ page }) => {
  20 |   // Naviguer vers la page d'accueil
  21 |   await page.goto('/')
  22 |
  23 |   // Cliquer sur le bouton pour créer un nouveau chat
  24 |   await page.getByRole('button', { name: /nouveau chat/i }).click()
  25 |
  26 |   // Vérifier que l'URL a changé et contient "/chat/"
  27 |   await expect(page).toHaveURL(/\/chat\//)
  28 |
  29 |   // Vérifier que la zone de saisie de message est visible
  30 |   await expect(page.locator('textarea, input[type="text"]')).toBeVisible()
  31 | })
  32 |
```