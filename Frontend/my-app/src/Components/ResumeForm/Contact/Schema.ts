// contactSchema.ts
import { z } from 'zod';

export const contactSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  phone: z.string().min(10, "Phone must be at least 10 digits"),
  summary: z.string().min(1, "Summary is required"),
  linkedin: z.string().url("Invalid LinkedIn URL").optional().or(z.literal("")),
  github: z.string().url("Invalid GitHub URL").optional().or(z.literal("")),
  devpost: z.string().url("Invalid Devpost URL").optional().or(z.literal("")),
});
