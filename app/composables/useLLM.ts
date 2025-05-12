export function useLLM() {
  const models = [
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
    'gemini-1.5-pro',
    'gemini-1.5-pro-latest',
    'gemini-1.5-turbo',
    'gemini-2.0-flash-thinking-exp-01-21',
    'gemini-2.0-flash-exp'
  ]
  const model = useCookie<string>('llm-model', { default: () => 'gemini-1.5-pro' })

  return {
    models,
    model
  }
}
