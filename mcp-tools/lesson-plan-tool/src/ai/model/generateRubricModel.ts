import z from "zod";
import { openai } from "../../openai/openAiClient";
import { RubricInput, rubricInputSchema } from "../../schemas/inputs/rubricInput";
import { RubricOutput, rubricOutputSchema } from "../../schemas/outputs/rubricOutput";


export async function generateRubricModel(
  rawInput: RubricInput
): Promise<RubricOutput> {
  const input = rubricInputSchema.parse(rawInput);

  const styleInstructions: Record<string, string> = {
    concise: "Use short, clear descriptors.",
    detailed: "Provide detailed, specific descriptors.",
    standards_based:
      "Align descriptors with common educational standards terminology.",
  };

  const styleMessage = styleInstructions[input.style ?? "concise"];

  const systemPrompt = `
    You are an expert educator who writes clear, structured grading rubrics.


    ${styleMessage}


    Return ONLY valid JSON that matches this schema:

    interface Rubric {
        criteria: {
            name: string,
            descriptors: {
                level: string,
                description: string
            }[],
        }[],
        objective: string,
        gradeLevel: string,
        skill: string
    }

    Ensure the number of descriptors per criterion equals the "levels" request.
  `.trim();

  
  const userPrompt = `
Generate a rubric:

Objective: ${input.objective}
Grade Level: ${input.gradeLevel}
Skill: ${input.skill}
Levels: ${input.levels}
  `.trim();


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
            name: 'generate_rubric',
            strict: true,
            description: 'Structured rubric generator',
            parameters: z.toJSONSchema(rubricOutputSchema),
          },
    ],
  });

  const content = response.output_text.trim();
  if (!content) {
    throw new Error('Model did not return text content');
  }
  const parsed = rubricOutputSchema.safeParse(JSON.parse(content));

  if (!parsed.success) {
    console.error('Validation error:', parsed.error);
    throw new Error(`Model returned invalid rubric JSON format. ${parsed.error.message}`);
  }

  return parsed.data;
}
