import { drizzle } from 'drizzle-orm/postgres-js'
import postgres from 'postgres'

import * as schema from '../database/schema'

export { sql, eq, and, or } from 'drizzle-orm'

const { databaseUrl } = useRuntimeConfig()

export const tables = schema
const queryClient = postgres(databaseUrl, { max: 1 })

export function useDrizzle() {
  return drizzle(queryClient, { schema })
}

export type Chat = typeof schema.chats.$inferSelect
export type Message = typeof schema.messages.$inferSelect
