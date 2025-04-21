export function useLLM() {
  const models = [
    'gemini-2.0-flash',
    'gemini-2.0-flash-lite',
    'gemini-1.5-flash',
    'gemini-1.5-flash-8b',
    'gemini-1.5-pro',
    'gemini-1.5-turbo'
  ]
  const model = useCookie<string>('llm-model', { default: () => 'gemini-1.5-pro' })

  return {
    models,
    model
  }
}
