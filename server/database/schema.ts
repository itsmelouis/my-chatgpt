import { pgTable, uuid, text, timestamp, integer, index, unique, pgEnum } from 'drizzle-orm/pg-core'
import { sql, relations } from 'drizzle-orm'

// ENUM pour les providers et rôles
export const providerEnum = pgEnum('provider', ['github'])
export const roleEnum = pgEnum('role', ['user', 'assistant'])

export const users = pgTable('users', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  email: text('email').notNull(),
  name: text('name').notNull(),
  avatar: text('avatar').notNull(),
  username: text('username').notNull(),
  provider: providerEnum('provider').notNull(),
  providerId: integer('provider_id').notNull(),
  createdAt: timestamp('created_at', { withTimezone: false }).notNull().defaultNow()
}, t => [
  unique().on(t.provider, t.providerId)
])

export const usersRelations = relations(users, ({ many }) => ({
  chats: many(chats)
}))

export const chats = pgTable('chats', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  title: text('title'),
  userId: uuid('user_id').notNull().references(() => users.id, { onDelete: 'cascade' }),
  createdAt: timestamp('created_at', { withTimezone: false }).notNull().defaultNow()
}, t => [
  index('user_id_idx').on(t.userId)
])

export const chatsRelations = relations(chats, ({ one, many }) => ({
  user: one(users, {
    fields: [chats.userId],
    references: [users.id]
  }),
  messages: many(messages)
}))

export const messages = pgTable('messages', {
  id: uuid('id').primaryKey().default(sql`uuid_generate_v4()`),
  chatId: uuid('chat_id').notNull().references(() => chats.id, { onDelete: 'cascade' }),
  role: roleEnum('role').notNull(),
  content: text('content').notNull(),
  createdAt: timestamp('created_at', { withTimezone: false }).notNull().defaultNow()
}, t => [
  index('chat_id_idx').on(t.chatId)
])

export const messagesRelations = relations(messages, ({ one }) => ({
  chat: one(chats, {
    fields: [messages.chatId],
    references: [chats.id]
  })
}))
