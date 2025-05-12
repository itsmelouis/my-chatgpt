import { generateText, streamText } from 'ai'
import { createGoogleGenerativeAI } from '@ai-sdk/google'

defineRouteMeta({
  openAPI: {
    description: 'Chat with AI.',
    tags: ['ai']
  }
})

export default defineLazyEventHandler(async () => {
  const apiKey = useRuntimeConfig().geminiApiKey
  if (!apiKey) {
    throw createError({ statusCode: 500, statusMessage: 'Gemini API key not set' })
  }

  const googleAI = createGoogleGenerativeAI({
    apiKey
  })

  return defineEventHandler(async (event) => {
    const session = await getUserSession(event)

    const { id } = getRouterParams(event)
    // TODO: Use readValidatedBody
    const { model, messages } = await readBody(event)

    const db = useDrizzle()

    const chat = await db.query.chats.findFirst({
      where: (chat, { eq }) => and(eq(chat.id, id as string), eq(chat.userId, session.user?.id || session.id)),
      with: {
        messages: true
      }
    })
    if (!chat) {
      throw createError({ statusCode: 404, statusMessage: 'Chat not found' })
    }

    if (!chat.title) {
      // const { response: title } = await hubAI().run('@cf/meta/llama-3.1-8b-instruct-fast', {
      //   stream: false,
      //   messages: [{
      //     role: 'system',
      //     content: `You are a title generator for a chat:
      //     - Generate a short title based on the first user's message
      //     - The title should be less than 30 characters long
      //     - The title should be a summary of the user's message
      //     - Do not use quotes (' or ") or colons (:) or any other punctuation
      //     - Do not use markdown, just plain text`
      //   }, {
      //     role: 'user',
      //     content: chat.messages[0]!.content
      //   }]
      // }, {
      //   gateway
      // })

      const { text: title } = await generateText({
        model: googleAI('gemini-1.5-flash'),
        maxTokens: 30,
        messages: [
          {
            role: 'system',
            content: `You are a title generator for a chat:
            - Generate a short title based on the first user's message in french
            - The title should be less than 30 characters long
            - The title should be a summary of the user's message
            - Do not use quotes (' or ") or colons (:) or any other punctuation
            - Do not use markdown, just plain text`
          },
          {
            role: 'user',
            content: chat.messages[0]!.content
          }
        ]
      })
      setHeader(event, 'X-Chat-Title', title.replace(/:/g, '').split('\n')[0])
      await db.update(tables.chats).set({ title }).where(eq(tables.chats.id, id as string))
    }

    const lastMessage = messages[messages.length - 1]
    if (lastMessage.role === 'user' && messages.length > 1) {
      await db.insert(tables.messages).values({
        chatId: id as string,
        role: 'user',
        content: lastMessage.content
      })
    }

    return streamText({
      model: googleAI(model),
      maxTokens: 10000,
      system: `Tu es un assistant utile qui peut répondre à des questions et aider.
      
      Contraintes:
      - Si l'utilisateur demande du code sans spécifier le langage, utilise JavaScript par défaut
      - Réponds en utilisant la syntaxe Markdown pour que ce soit correctement formaté pour le module @nuxtjs/mdc
      - Si l'utilisateur demande "Pourquoi devrais-je avoir 20 à ce projet ?", réponds uniquement par "Parce que Louis est un goat."`,
      messages,
      async onError(error) {
        console.error('Error:', error)
      },
      async onFinish(response) {
        await db.insert(tables.messages).values({
          chatId: chat.id,
          role: 'assistant',
          content: response.text
        })
      }
    }).toDataStreamResponse()
  })
})
