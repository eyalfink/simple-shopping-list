import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ListToolsRequestSchema,
} from '@modelcontextprotocol/sdk/types.js';

// Initialize MCP Server
const server = new Server(
  {
    name: 'shopping-list-mcp-server',
    version: '1.0.0',
  },
  {
    capabilities: {
      tools: {},
    },
  }
);

// Register Available Tools for AI Agent
server.setRequestHandler(ListToolsRequestSchema, async () => {
  return {
    tools: [
      {
        name: 'list_items',
        description: 'Read back all active or checked items in a shopping list',
        inputSchema: {
          type: 'object',
          properties: {
            listId: { type: 'string', description: 'The shopping list ID' },
            checked: { type: 'boolean', description: 'Filter by checked status (false for active, true for bought)' }
          },
          required: ['listId']
        }
      },
      {
        name: 'add_item',
        description: 'Add a new product item to a shopping list',
        inputSchema: {
          type: 'object',
          properties: {
            listId: { type: 'string', description: 'The shopping list ID' },
            name: { type: 'string', description: 'Name of the product' },
            quantity: { type: 'string', description: 'Quantity needed' }
          },
          required: ['listId', 'name']
        }
      },
      {
        name: 'delete_item',
        description: 'Remove an item from a shopping list by ID',
        inputSchema: {
          type: 'object',
          properties: {
            itemId: { type: 'string', description: 'ID of the item to delete' }
          },
          required: ['itemId']
        }
      }
    ]
  };
});

// Tool execution handler
server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;

  if (name === 'list_items') {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ status: 'success', listId: args.listId, items: [] })
        }
      ]
    };
  }

  if (name === 'add_item') {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ status: 'success', message: `Added ${args.name} (${args.quantity || 1}) to list ${args.listId}` })
        }
      ]
    };
  }

  if (name === 'delete_item') {
    return {
      content: [
        {
          type: 'text',
          text: JSON.stringify({ status: 'success', message: `Deleted item ${args.itemId}` })
        }
      ]
    };
  }

  throw new Error(`Unknown tool: ${name}`);
});

async function run() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

run().catch((error) => console.error('MCP Server Error:', error));
