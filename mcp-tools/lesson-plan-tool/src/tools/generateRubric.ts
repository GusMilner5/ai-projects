import { evaluateRubric } from "../ai/evaluation/evaluateRubric";
import { generateRubricModel } from "../ai/model/generateRubricModel";
import { RubricInput, rubricInputSchema } from "../schemas/inputs/rubricInput";

export const generateRubricName = "generate_rubric";

export const generateRubricDescription =
  "Generate a structured grading rubric for a learning objective.";

export const generateRubricHandler = async (args: RubricInput) => {
  try {
    const input = rubricInputSchema.parse(args);

    const rubric = await generateRubricModel(input);
    const warnings = evaluateRubric(rubric);

    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({ rubric, warnings }, null, 2),
        },
      ],
    };
  } catch (err: any) {
    return {
      content: [
        {
          type: 'text' as const,
          text: `Error generating rubric: ${err.message}`,
        },
      ],
    };
  }
};
