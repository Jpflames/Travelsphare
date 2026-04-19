import { z } from "zod";

export const registerUserSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email(),
  password: z.string().min(8).max(128),
});

export function sanitizeText(input: string) {
  return input.replace(/[<>]/g, "").trim();
}
