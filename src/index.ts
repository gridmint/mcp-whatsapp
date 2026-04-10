import { Server } from "@modelcontextprotocol/sdk/server/index.js"
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js"
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js"
import { createWhatsAppClient } from "./client.js"
import { getTools, handleToolCall } from "./tools/index.js"

const server = new Server(
	{
		name: "mcp-whatsapp",
		version: "0.2.0",
	},
	{
		capabilities: {
			tools: {},
		},
	},
)

const client = await createWhatsAppClient()

server.setRequestHandler(ListToolsRequestSchema, async () => ({
	tools: getTools(),
}))

server.setRequestHandler(CallToolRequestSchema, async (request) => {
	const { name, arguments: args } = request.params
	return handleToolCall(client, name, args)
})

const transport = new StdioServerTransport()
await server.connect(transport)
