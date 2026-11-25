// src/config/env.ts
import dotenv from "dotenv";
dotenv.config();

import { z } from 'zod';

const envSchema = z.object({
  // App
  NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
  PORT: z.string().optional(),

  // JWT
  JWT_ACCESS_SECRET: z.string().min(32, 'JWT_ACCESS_SECRET must be at least 32 chars'),
  JWT_REFRESH_SECRET: z.string().min(32, 'JWT_REFRESH_SECRET must be at least 32 chars'),
  REFRESH_TOKEN_EXPIRES: z.string().default('365d'),

  // Database
  MONGO_URI: z.string().min(1, 'MONGO_URI is required'),

  // CORS / Frontend
  FRONTEND_ORIGIN: z.string().default('http://localhost:3000'),
  CLIENT_URL: z.string().default('http://localhost:3000'),

});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
  console.error('❌ Invalid environment variables:');
  console.error(parsed.error.flatten().fieldErrors);
  throw new Error('Invalid environment configuration. Check your .env file.');
}

export const env = parsed.data;

export type Env = typeof env;