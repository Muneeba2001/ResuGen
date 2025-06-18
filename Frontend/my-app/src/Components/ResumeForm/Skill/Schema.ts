// schemas/skillsSchema.ts
import { z } from 'zod';

export const skillsSchema = z.object({
  skills: z
    .array(z.string().min(1, 'Skill cannot be empty'))
    .nonempty('Please enter at least one skill'),
});

// For inference in TypeScript
export type SkillsFormData = z.infer<typeof skillsSchema>;
