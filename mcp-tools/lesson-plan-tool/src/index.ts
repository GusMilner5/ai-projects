import "dotenv/config";
import OpenAI from "openai";

async function main() {
  const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const response = await client.chat.completions.create({
    model: "gpt-5-mini",
    messages: [
      { role: "system", content: "Return JSON only." },
      { role: "user", content: "Generate a quick lesson objective for 3rd grade math." }
    ],
    response_format: { type: "json_object" }
  });

  console.log("LLM Response:\n", response.choices[0]?.message?.content);
}

main();
