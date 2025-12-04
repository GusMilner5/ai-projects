import { z } from "zod";

export const rubricInputSchema = z.object({
  objective: z.string().min(5, "Objective is required"),
  gradeLevel: z.string().min(1),
  skill: z.string().min(1),
  levels: z.number().int().min(2).max(6).default(4),
  style: z
    .enum(["concise", "detailed", "standards_based"])
    .optional()
    .default("concise"),
});

export type RubricInput = z.infer<typeof rubricInputSchema>;
