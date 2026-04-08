import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import type { WASocket } from "../client.js"

export const messagingTools: Tool[] = [
	{
		name: "send_message",
		description: "Send a text message to a WhatsApp chat",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Chat JID (e.g. 1234567890@s.whatsapp.net)" },
				text: { type: "string", description: "Message text" },
			},
			required: ["jid", "text"],
		},
	},
	{
		name: "send_image",
		description: "Send an image to a WhatsApp chat",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Chat JID" },
				url: { type: "string", description: "Image URL or local file path" },
				caption: { type: "string", description: "Optional caption" },
			},
			required: ["jid", "url"],
		},
	},
	{
		name: "send_document",
		description: "Send a document/file to a WhatsApp chat",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Chat JID" },
				url: { type: "string", description: "File URL or local path" },
				filename: { type: "string", description: "Display filename" },
				caption: { type: "string", description: "Optional caption" },
			},
			required: ["jid", "url"],
		},
	},
	{
		name: "send_reaction",
		description: "React to a message with an emoji",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Chat JID" },
				message_id: { type: "string", description: "Message ID to react to" },
				emoji: { type: "string", description: "Reaction emoji" },
			},
			required: ["jid", "message_id", "emoji"],
		},
	},
	{
		name: "read_messages",
		description: "Read recent messages from a WhatsApp chat",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Chat JID" },
				limit: { type: "number", description: "Number of messages (default: 20)" },
			},
			required: ["jid"],
		},
	},
	{
		name: "delete_message",
		description: "Delete a message for everyone",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Chat JID" },
				message_id: { type: "string", description: "Message ID to delete" },
			},
			required: ["jid", "message_id"],
		},
	},
	{
		name: "edit_message",
		description: "Edit a sent message",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Chat JID" },
				message_id: { type: "string", description: "Message ID to edit" },
				text: { type: "string", description: "New text" },
			},
			required: ["jid", "message_id", "text"],
		},
	},
	{
		name: "forward_message",
		description: "Forward a message to another chat",
		inputSchema: {
			type: "object",
			properties: {
				from_jid: { type: "string", description: "Source chat JID" },
				to_jid: { type: "string", description: "Destination chat JID" },
				message_id: { type: "string", description: "Message ID to forward" },
			},
			required: ["from_jid", "to_jid", "message_id"],
		},
	},
]

export async function handleMessagingTool(client: WASocket, args: any): Promise<any> {
	switch (args.toolName) {
		case "send_message":
			return client.sendMessage(args.jid, { text: args.text })

		case "send_image":
			return client.sendMessage(args.jid, {
				image: { url: args.url },
				caption: args.caption,
			})

		case "send_document":
			return client.sendMessage(args.jid, {
				document: { url: args.url },
				fileName: args.filename,
				caption: args.caption,
			})

		case "send_reaction":
			return client.sendMessage(args.jid, {
				react: { text: args.emoji, key: { id: args.message_id, remoteJid: args.jid } },
			})

		case "delete_message":
			return client.sendMessage(args.jid, {
				delete: { id: args.message_id, remoteJid: args.jid, fromMe: true },
			})

		case "edit_message":
			return client.sendMessage(args.jid, {
				edit: { id: args.message_id, remoteJid: args.jid, fromMe: true },
				text: args.text,
			})

		default:
			throw new Error(`Unknown messaging tool: ${args.toolName}`)
	}
}
