import { z } from "zod";

export const rubricOutputSchema = z.object({
  criteria: z.array(
    z.object({
      name: z.string(),
      descriptors: z.array(
        z.object({
          level: z.string(),
          description: z.string(),
        })
      ),
    })
  ),
  objective: z.string(),
  gradeLevel: z.string(),
  skill: z.string(),
});

export type RubricOutput = z.infer<typeof rubricOutputSchema>;
