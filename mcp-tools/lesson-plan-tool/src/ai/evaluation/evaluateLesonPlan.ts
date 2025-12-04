import { LessonPlanOutput } from "../../tools/generateLessonPlan";

export function evaluateLessonPlan(plan: LessonPlanOutput): string[] {
  const issues: string[] = [];


  const totalAgenda = plan.agenda.reduce((acc, a) => acc + a.minutes, 0);

  if (Math.abs(totalAgenda - plan.durationMinutes) > 5) {
    issues.push(
      `Agenda minutes (${totalAgenda}) do not match durationMinutes (${plan.durationMinutes}).`
    );
  }

  
  if (plan.materials.length === 0) {
    issues.push("No materials included.");
  }

  // Basic hallucination guard
  if (!plan.lessonTitle.toLowerCase().includes(plan.subject.toLowerCase())) {
    issues.push("Lesson title does not reference the subject.");
  }

  return issues;
}
