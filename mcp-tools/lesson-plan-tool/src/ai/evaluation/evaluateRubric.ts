import { RubricOutput } from "../../schemas/outputs/rubricOutput";

export function evaluateRubric(rubric: RubricOutput): string[] {
  const issues: string[] = [];

  const levelCounts = rubric.criteria.map((c) => c.descriptors.length);
  const allSame = levelCounts.every((c) => c === levelCounts[0]);

  if (!allSame) {
    issues.push("Not all criteria have the same number of proficiency levels.");
  }

  return issues;
}
