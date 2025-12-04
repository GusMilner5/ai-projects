import z from 'zod';
import { lessonPlanInputSchema, type LessonPlanInput } from '../schemas/inputs/lessonPlanInput';
import { generateLessonPlanModel } from '../ai/model/generateLessonPlanModel';
import { evaluateLessonPlan } from '../ai/evaluation/evaluateLesonPlan';

export const generateLessonPlanName = 'generate_lesson_plan';

export const generateLessonPlanDescription =
  'Generate a detailed lesson plan using an LLM, based on subject, grade level, and duration.';

export const lessonPlanOutputSchema = z.object({
  lessonTitle: z.string(),
  objective: z.string(),
  durationMinutes: z.number(),
  agenda: z.array(
    z.object({
      name: z.string(),
      minutes: z.number(),
    })
  ),
  materials: z.array(z.string()),
  gradeLevel: z.string(),
  subject: z.string(),
});

export type LessonPlanOutput = z.infer<typeof lessonPlanOutputSchema>;

export const generateLessonPlanHandler = async (args: LessonPlanInput) => {

  try {
    const input = lessonPlanInputSchema.parse(args);
    const lessonPlan = await generateLessonPlanModel(input);

    const issues = evaluateLessonPlan(lessonPlan);

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({ lessonPlan, issues }, null, 2),
        },
      ],
    };
  } catch (err: any) {
    return {
      content: [
        {
          type: 'text' as const,
          text: `Error generating lesson plan: ${err.message}`,
        },
      ],
    };
  }
};
