import { pgTable, serial, text, varchar, integer } from "drizzle-orm/pg-core";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: varchar("email", { length: 255 }).notNull().unique(),
  role: text("role").default("user"),
  supabase_id: varchar("supabase_id", { length: 255 }).notNull().unique(),
});

export const businesses = pgTable("businesses", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description"),
  owner_id: integer("owner_id").notNull().references(() => users.id),
});
