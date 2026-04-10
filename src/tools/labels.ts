import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import type { WASocket } from "../client.js"

export const labelTools: Tool[] = [
	{
		name: "add_chat_label",
		description: "Add a label to a chat (WhatsApp Business feature)",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Chat JID" },
				label_id: { type: "string", description: "Label ID" },
			},
			required: ["jid", "label_id"],
		},
	},
	{
		name: "remove_chat_label",
		description: "Remove a label from a chat",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Chat JID" },
				label_id: { type: "string", description: "Label ID" },
			},
			required: ["jid", "label_id"],
		},
	},
	{
		name: "add_message_label",
		description: "Add a label to a specific message",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Chat JID" },
				message_id: { type: "string", description: "Message ID" },
				label_id: { type: "string", description: "Label ID" },
			},
			required: ["jid", "message_id", "label_id"],
		},
	},
	{
		name: "remove_message_label",
		description: "Remove a label from a specific message",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Chat JID" },
				message_id: { type: "string", description: "Message ID" },
				label_id: { type: "string", description: "Label ID" },
			},
			required: ["jid", "message_id", "label_id"],
		},
	},
]

export async function handleLabelTool(client: WASocket, args: any): Promise<any> {
	switch (args.toolName) {
		case "add_chat_label":
			await client.addChatLabel(args.jid, args.label_id)
			return { success: true }

		case "remove_chat_label":
			await client.removeChatLabel(args.jid, args.label_id)
			return { success: true }

		case "add_message_label":
			await client.addMessageLabel(args.jid, args.message_id, args.label_id)
			return { success: true }

		case "remove_message_label":
			await client.removeMessageLabel(args.jid, args.message_id, args.label_id)
			return { success: true }

		default:
			throw new Error(`Unknown label tool: ${args.toolName}`)
	}
}
