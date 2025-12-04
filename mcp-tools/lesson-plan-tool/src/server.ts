import 'dotenv/config';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';

import {
  generateLessonPlanName,
  generateLessonPlanDescription,
  generateLessonPlanHandler,
} from './tools/generateLessonPlan';
import { lessonPlanInputSchema } from './schemas/inputs/lessonPlanInput';
import { generateRubricDescription, generateRubricHandler, generateRubricName } from './tools/generateRubric';
import { rubricInputSchema } from './schemas/inputs/rubricInput';

const mcpServer = new McpServer({
  name: 'lesson-plan-mcp-server',
  version: '0.0.1',
});

mcpServer.registerTool(
  generateLessonPlanName,
  {
    description: generateLessonPlanDescription,
    inputSchema: lessonPlanInputSchema,
  },
  generateLessonPlanHandler
);

mcpServer.registerTool(
    generateRubricName,
    {
      description: generateRubricDescription,
      inputSchema: rubricInputSchema,
    },
    generateRubricHandler
  );

async function main() {
  const transport = new StdioServerTransport();
  await mcpServer.connect(transport);
  console.log('MCP server is running...');
}

main().catch((error) => {
  console.error('Server error:', error);
  process.exit(1);
});
