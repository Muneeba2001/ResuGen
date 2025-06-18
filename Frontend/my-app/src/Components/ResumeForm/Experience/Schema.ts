// schema.ts
import { z } from "zod";

export const experienceItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  company: z.string().min(1, "Company is required"),
  duration: z.string().min(1, "Duration is required"),
});

export const educationItemSchema = z.object({
  degree: z.string().min(1, "Degree is required"),
  institution: z.string().min(1, "Institution is required"),
  year: z.string().min(1, "Year is required"),
});

export const projectItemSchema = z.object({
  title: z.string().min(1, "Title is required"),
  link: z.string().optional(),
});

export const expEduProjSchema = z.object({
  experiences: z.array(experienceItemSchema).min(1),
  education: z.array(educationItemSchema).min(1),
  projects: z.array(projectItemSchema).optional(),
});

export type ExpEduProjFormData = z.infer<typeof expEduProjSchema>;
