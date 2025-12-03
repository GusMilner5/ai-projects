import { z } from "zod";

export const lessonPlanInputSchema = z.object({
  subject: z.string().min(1, "Subject is required"),
  gradeLevel: z.string().min(1, "Grade level is required"),
  durationMinutes: z.number().int().positive().optional().default(30),
});

export type LessonPlanInput = z.infer<typeof lessonPlanInputSchema>;
