import { AsyncMemoryClient } from 'mem0ai';

export const mem0Client = new AsyncMemoryClient({
  apiKey: process.env.MEM0_API_KEY!,
});