import z from 'zod';
import { type LessonPlanInput } from '../schemas/lessonPlanInput';
import { openai } from '../openai/openAiClient';

export const generateLessonPlanName = 'generate_lesson_plan';

export const generateLessonPlanDescription =
  'Generate a detailed lesson plan using an LLM, based on subject, grade level, and duration.';

const lessonPlanOutputSchema = z.object({
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
  const { subject, gradeLevel, durationMinutes } = args;

  try {
    const systemPrompt = `
        You are an expert educator who creates structured, accurate lesson plans.

        Return ONLY valid JSON that matches this TypeScript type:

        interface LessonPlan {
        lessonTitle: string;
        objective: string;
        durationMinutes: number;
        agenda: { name: string; minutes: number; }[];
        materials: string[];
        gradeLevel: string;
        subject: string;
        }

        Ensure the total minutes in agenda roughly match durationMinutes.
        `;

    const userPrompt = `
        Generate a lesson plan for:

        - Subject: ${subject}
        - Grade Level: ${gradeLevel}
        - Duration: ${durationMinutes} minutes

        Return ONLY JSON, no extra commentary.
    `;

    const response = await openai.responses.create({
      model: 'gpt-5-mini',
      input: [
        {
          role: 'system',
          content: systemPrompt,
        },
        {
          role: 'user',
          content: userPrompt,
        },
      ],
      tools: [
        {
          type: 'function',
          name: 'generate_lesson_plan',
          strict: true,
          description: 'Structured lesson plan generator',
          parameters: z.toJSONSchema(lessonPlanOutputSchema),
        },
      ],
      max_output_tokens: 800,
    });

    const content = response.output_text;
    if (!content) {
      throw new Error('Model did not return text content');
    }

    const parsed = lessonPlanOutputSchema.safeParse(JSON.parse(content));

    if (!parsed.success) {
      console.error('Validation error:', parsed.error);
      throw new Error('Model returned invalid lesson plan JSON format.');
    }

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(parsed.data, null, 2),
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
