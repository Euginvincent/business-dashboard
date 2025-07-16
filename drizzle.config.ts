// import { defineConfig } from 'drizzle-kit';

// export default defineConfig({
//   schema: './db/schema.ts',
//   out: './db/migrations',
//   dialect: 'postgresql',
//   dbCredentials: {
//     connectionString: process.env.DATABASE_URL!,
//   },
// });

// import { defineConfig } from 'drizzle-kit';

// export default defineConfig({
//   schema: './db/schema.ts',
//   out: './db/migrations',
//   dialect: 'postgresql',
//   dbCredentials: {
//     host: 'db.iioelerffgadtoiglobb.supabase.co',
//     port: 5432,
//     user: 'postgres',
//     password: 'Admin@654321#.', 
//     database: 'postgres',
//     ssl: true, 
//   },
// });

// drizzle.config.ts

import { defineConfig } from 'drizzle-kit';
import * as dotenv from 'dotenv';

dotenv.config(); // loads from .env

export default defineConfig({
  schema: './db/schema.ts',
  out: './db/migrations',
  dialect: 'postgresql',
  dbCredentials: {
    host: process.env.DB_HOST!,
    port: Number(process.env.DB_PORT!),
    user: process.env.DB_USER!,
    password: process.env.DB_PASSWORD!,
    database: process.env.DB_NAME!,
    ssl: { rejectUnauthorized: false },
  },
});
