
import { lessonPlanInputSchema, type LessonPlanInput } from "../schemas/lessonPlanInput";


export const generateLessonPlanName = "generate_lesson_plan";

export const generateLessonPlanDescription =
  "Generate a basic lesson plan structure for a given subject and grade level.";

export const generateLessonPlanHandler = async (args: LessonPlanInput) => {
  const { subject, gradeLevel, durationMinutes } = args;

  const remainingMinutes = Math.max(durationMinutes - 25, 5);

  const lesson = {
    lessonTitle: `${gradeLevel} ${subject} - Intro Lesson`,
    durationMinutes,
    objective:
      "Students will be able to demonstrate a basic understanding of the topic at a foundational level.",
    agenda: [
      { name: "Warm-up / Prior Knowledge", minutes: 5 },
      { name: "Direct Instruction", minutes: 10 },
      { name: "Guided Practice", minutes: 10 },
      { name: "Exit Ticket / Assessment", minutes: remainingMinutes },
    ],
    materials: ["Whiteboard", "Markers", "Student notebooks"],
    gradeLevel,
    subject,
  };

  return {
    content: [
      {
        type: "text" as const,
        text: JSON.stringify(lesson, null, 2),
      },
    ],
  };
};

