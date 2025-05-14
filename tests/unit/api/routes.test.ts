/* eslint-disable @typescript-eslint/ban-ts-comment */
import { describe, it, expect } from 'vitest'
import { $fetch } from '@nuxt/test-utils'

describe('API Routes', () => {
  // Test pour GET /api/chats
  describe('GET /api/chats', () => {
    it('devrait retourner un tableau de chats', async () => {
      try {
        const response = await $fetch('/api/chats', { method: 'GET' })

        // Vérifier que la réponse est un tableau
        expect(Array.isArray(response)).toBe(true)

        // Si des chats sont présents, vérifier leur structure
        if (response.length > 0) {
          expect(response[0]).toHaveProperty('id')
          expect(response[0]).toHaveProperty('title')
          expect(response[0]).toHaveProperty('userId')
          expect(response[0]).toHaveProperty('createdAt')
        }
      } catch (error) {
        // Si l'API n'est pas disponible ou renvoie une erreur, le test échouera
        expect(error).toBeUndefined()
      }
    })
  })

  // Test pour POST /api/chats
  describe('POST /api/chats', () => {
    it('devrait créer un nouveau chat', async () => {
      try {
        const response = await $fetch('/api/chats', {
          method: 'POST',
          body: { input: 'Message de test pour un nouveau chat' }
        })

        // Vérifier la structure de la réponse
        expect(response).toHaveProperty('id')
        expect(response).toHaveProperty('title')
        expect(response).toHaveProperty('userId')
        expect(response).toHaveProperty('createdAt')

        // Le titre devrait être vide initialement
        expect(response?.title).toBe('')
      } catch (error) {
        expect(error).toBeUndefined()
      }
    })
  })

  // Test pour GET /api/chats/[id]
  describe('GET /api/chats/[id]', () => {
    it('devrait retourner un chat spécifique avec ses messages', async () => {
      try {
        // D'abord créer un chat pour avoir un ID valide
        const newChat = await $fetch('/api/chats', {
          method: 'POST',
          body: { input: 'Message pour tester GET /api/chats/[id]' }
        })

        // Ensuite récupérer ce chat par son ID
        const response = await $fetch(`/api/chats/${newChat?.id}`, { method: 'GET' })

        // Vérifier la structure de la réponse
        expect(response).toHaveProperty('id')
        expect(response).toHaveProperty('title')
        expect(response).toHaveProperty('userId')
        expect(response).toHaveProperty('createdAt')
        expect(response).toHaveProperty('messages')

        // Vérifier que l'ID correspond
        expect(response?.id).toBe(newChat?.id)

        // Vérifier que les messages sont un tableau
        expect(Array.isArray(response?.messages)).toBe(true)

        // Vérifier la structure du premier message si présent
        // @ts-ignore
        if (response?.messages.length > 0) {
          expect(response?.messages[0]).toHaveProperty('id')
          expect(response?.messages[0]).toHaveProperty('chatId')
          expect(response?.messages[0]).toHaveProperty('role')
          expect(response?.messages[0]).toHaveProperty('content')
          expect(response?.messages[0]).toHaveProperty('createdAt')
        }
      } catch (error) {
        expect(error).toBeUndefined()
      }
    })

    it('devrait retourner une erreur 404 pour un ID inexistant', async () => {
      try {
        await $fetch('/api/chats/id-inexistant', { method: 'GET' })
        // Si on arrive ici, le test échoue car on devrait avoir une erreur
        expect(true).toBe(false)
      } catch (error: unknown) {
        // Vérifier que l'erreur est bien un 404
        expect((error as { response: { status: number } })?.response?.status).toBe(404)
      }
    })
  })

  // Test pour DELETE /api/chats/[id]
  describe('DELETE /api/chats/[id]', () => {
    it('devrait supprimer un chat existant', async () => {
      try {
        // D'abord créer un chat pour avoir un ID valide
        const newChat = await $fetch('/api/chats', {
          method: 'POST',
          body: { input: 'Message pour tester DELETE /api/chats/[id]' }
        })

        // Ensuite supprimer ce chat
        const response = await $fetch(`/api/chats/${newChat?.id}`, { method: 'DELETE' })

        // Vérifier que la réponse contient le chat supprimé
        expect(Array.isArray(response)).toBe(true)

        if (response.length > 0) {
          expect(response[0]).toHaveProperty('id')
          expect(response[0]?.id).toBe(newChat?.id)
        }

        // Vérifier que le chat n'existe plus
        try {
          await $fetch(`/api/chats/${newChat?.id}`, { method: 'GET' })
          // Si on arrive ici, le test échoue car le chat devrait être supprimé
          expect(true).toBe(false)
        } catch (error: unknown) {
          expect((error as { response: { status: number } })?.response?.status).toBe(404)
        }
      } catch (error) {
        expect(error).toBeUndefined()
      }
    })

    it('devrait retourner un tableau vide pour un ID inexistant', async () => {
      try {
        const response = await $fetch('/api/chats/id-inexistant', { method: 'DELETE' })

        // Vérifier que la réponse est un tableau vide
        expect(Array.isArray(response)).toBe(true)
        expect(response.length).toBe(0)
      } catch (error) {
        expect(error).toBeUndefined()
      }
    })
  })

  // Test pour POST /api/chats/[id]/generate
  describe('POST /api/chats/[id]/generate', () => {
    it('devrait générer une réponse AI pour un chat existant', async () => {
      try {
        // D'abord créer un chat pour avoir un ID valide
        const newChat = await $fetch('/api/chats', {
          method: 'POST',
          body: { input: 'Dis-moi bonjour' }
        })

        // Ensuite générer une réponse AI
        const response = await $fetch(`/api/chats/${newChat?.id}/generate`, {
          method: 'POST',
          body: { input: 'Dis-moi bonjour' }
        })

        // Vérifier que la réponse contient un message
        expect(response).toHaveProperty('id')
        expect(response).toHaveProperty('chatId')
        expect(response).toHaveProperty('role')
        expect(response).toHaveProperty('content')
        expect(response).toHaveProperty('createdAt')

        // Vérifier que le rôle est 'assistant'
        // @ts-ignore
        expect(response?.role).toBe('assistant')

        // Vérifier que le contenu n'est pas vide
        // @ts-ignore
        expect(response?.content).toBeTruthy()
      } catch (error) {
        expect(error).toBeUndefined()
      }
    })
  })
})
