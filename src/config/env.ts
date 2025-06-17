import { z } from "zod";

const envSchema = z.object({
  REDDIT_CLIENT_ID: z.string().min(1),
  REDDIT_CLIENT_SECRET: z.string().min(1),
  REDDIT_USERNAME: z.string().min(1),
  REDDIT_PASSWORD: z.string().min(1),
  GEMINI_API_KEY: z.string().min(1),
  GOOGLE_CLIENT_ID: z.string().min(1),
  GOOGLE_CLIENT_SECRET: z.string().min(1),
  GOOGLE_ACCESS_TOKEN: z.string().min(1),
  GOOGLE_REFRESH_TOKEN: z.string().min(1),
});

const env = envSchema.parse(process.env);

export default env;
