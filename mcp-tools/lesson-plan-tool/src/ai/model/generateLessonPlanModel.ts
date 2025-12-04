
import { openai } from "../../openai/openAiClient";
import { LessonPlanInput, lessonPlanInputSchema } from "../../schemas/lessonPlanInput";
import { LessonPlanOutput, lessonPlanOutputSchema } from "../../tools/generateLessonPlan";
import z from "zod";





export async function generateLessonPlanModel(
  input: LessonPlanInput
): Promise<LessonPlanOutput> {
  const { subject, gradeLevel, durationMinutes, style } =
    lessonPlanInputSchema.parse(input);

    const styleInstructions: Record<string, string> = {
        detailed: 'Provide extended detail in each agenda item.',
        project_based: 'Use a project-based learning structure.',
      };
     
      const styleInstruction =
       (input.style && styleInstructions[input.style]) ?? "";

  const systemPrompt = `
You are an expert educator who creates structured, accurate lesson plans.

${styleInstruction}

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
        Do not include any comments or extra explanations.
        Do not have any unescaped newlines or quotes in the JSON.
`.trim();

 

  const userPrompt = `
Generate a lesson plan:

Subject: ${subject}
Grade Level: ${gradeLevel}
Duration: ${durationMinutes} minutes

Return only JSON, no extra commentary.
`;

  const response = await openai.responses.create({
    model: 'gpt-5-mini',
    input: [
      {
        role: 'system',
        content: systemPrompt.trim(),
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

  // Extract tool call output
  const content = response.output_text.trim();
    if (!content) {
      throw new Error('Model did not return text content');
    }

    const parsed = lessonPlanOutputSchema.safeParse(JSON.parse(content));

    if (!parsed.success) {
      console.error('Validation error:', parsed.error);
      throw new Error(`Model returned invalid lesson plan JSON format. ${parsed.error.message}`);
    }

    return parsed.data;
}
