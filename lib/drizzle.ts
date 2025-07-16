import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';

// Use DATABASE_URL from your .env.local
const queryClient = postgres(process.env.DATABASE_URL!, {
  ssl: 'prefer',
});

export const db = drizzle(queryClient);
