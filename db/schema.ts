// import { pgTable, uuid, varchar, timestamp, text } from 'drizzle-orm/pg-core';
// import { relations } from 'drizzle-orm';

// export const users = pgTable('users', {
//   id: uuid('id').primaryKey().notNull(), // Supabase Auth user id
//   email: varchar('email', { length: 255 }).notNull().unique(),
//   firstname: varchar('firstname', { length: 100 }),
//   lastname: varchar('lastname', { length: 100 }),
//   mobile: varchar('mobile', { length: 20 }),
//   dob: varchar('dob', { length: 20 }),
//   role: varchar('role', { length: 20 }).default('user'),
//   createdAt: timestamp('created_at').defaultNow(),
// });

// export const businesses = pgTable('businesses', {
//   id: uuid('id').primaryKey().defaultRandom(),
//   user_id: uuid('user_id').notNull().references(() => users.id),
//   name: varchar('name', { length: 255 }).notNull(),
//   description: text('description'),
//   location: varchar('location', { length: 255 }),
//   createdAt: timestamp('created_at').defaultNow(),
// });

// db/schema.ts

// db/schema.ts

import { pgTable, uuid, varchar, timestamp, serial } from 'drizzle-orm/pg-core';

// Ref to Supabase Auth users
export const authUsers = pgTable('auth.users', {
  id: uuid('id').primaryKey(),
});

export const users = pgTable('users', {
  id: uuid('id').primaryKey(), // Supabase Auth user id
  email: varchar('email', { length: 255 }).notNull(),
  firstname: varchar('firstname', { length: 100 }),
  lastname: varchar('lastname', { length: 100 }),
  mobile: varchar('mobile', { length: 20 }),
  dob: varchar('dob', { length: 20 }),
  role: varchar('role', { length: 20 }).default('user'),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

export const businesses = pgTable('businesses', {
  id: serial('id').primaryKey(),
  name: varchar('name', { length: 255 }).notNull(),
  user_id: uuid('user_id')
    .notNull()
    .references(() => authUsers.id),
  created_at: timestamp('created_at').defaultNow().notNull(),
});

// export const userRelations = relations(users, ({ many }) => ({
//   businesses: many(businesses),
// }));

// export const businessRelations = relations(businesses, ({ one }) => ({
//   owner: one(users, {
//     fields: [businesses.user_id],
//     references: [users.id],
//   }),
// }));