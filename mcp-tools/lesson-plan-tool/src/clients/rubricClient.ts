import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import { generateRubricName } from '../tools/generateRubric';

async function main() {
  console.log('Starting MCP rubric client test...\n');

  // Create the client
  const client = new Client(
    {
      name: 'rubric-test-client',
      version: '1.0.0',
    },
    {
      capabilities: {},
    }
  );

  // Create transport that spawns the server process
  const transport = new StdioClientTransport({
    command: 'ts-node',
    args: ['src/server.ts'],
  });

  try {
    // Connect to the server
    console.log('Connecting to MCP server...');
    await client.connect(transport);
    console.log('Connected successfully!\n');

    // List available tools
    console.log('Listing available tools...');
    const toolsResponse = await client.listTools();
    console.log(`Found ${toolsResponse.tools.length} tool(s):`);
    toolsResponse.tools.forEach((tool) => {
      console.log(`  - ${tool.name}: ${tool.description || 'No description'}`);
    });

    // Call the generate_rubric tool with test data
    console.log('Calling generate_rubric tool...');
    const result = await client.callTool({
      name: generateRubricName,
      arguments: {
        objective: 'Students will be able to solve addition and subtraction problems using models and strategies.',
        gradeLevel: '3rd Grade',
        skill: 'Addition and Subtraction',
        levels: 4,
        style: 'concise',
      },
    });

    console.log('Tool call result:');
    console.log('=================');


    if (result.content) {
      console.log(JSON.stringify(result.content, null, 2));
    } else {
      console.log(JSON.stringify(result, null, 2));
    }

    console.log('\n✅ Test completed successfully!');
  } catch (error) {
    console.error('❌ Error during test:', error);
    process.exit(1);
  } finally {
    // Clean up
    await transport.close();
    console.log('\nClient disconnected.');
  }
}

main().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
