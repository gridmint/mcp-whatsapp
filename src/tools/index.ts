import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import type { WASocket } from "../client.js"
import { chatTools, handleChatTool } from "./chats.js"
import { contactTools, handleContactTool } from "./contacts.js"
import { handleMessagingTool, messagingTools } from "./messaging.js"

const allTools: Tool[] = [...messagingTools, ...chatTools, ...contactTools]

export function getTools(): Tool[] {
	return allTools
}

export async function handleToolCall(
	client: WASocket,
	name: string,
	args: any,
): Promise<{ content: Array<{ type: string; text: string }> }> {
	const handlers: Record<string, (client: WASocket, args: any) => Promise<any>> = {
		...Object.fromEntries(messagingTools.map((t) => [t.name, handleMessagingTool])),
		...Object.fromEntries(chatTools.map((t) => [t.name, handleChatTool])),
		...Object.fromEntries(contactTools.map((t) => [t.name, handleContactTool])),
	}

	const handler = handlers[name]
	if (!handler) {
		return {
			content: [{ type: "text", text: `Unknown tool: ${name}` }],
		}
	}

	try {
		const result = await handler(client, { toolName: name, ...args })
		return {
			content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
		}
	} catch (error: any) {
		return {
			content: [{ type: "text", text: `Error: ${error.message}` }],
		}
	}
}
