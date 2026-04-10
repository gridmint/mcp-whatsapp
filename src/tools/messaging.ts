import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import type { WASocket } from "../client.js"

export const messagingTools: Tool[] = [
	{
		name: "send_message",
		description:
			"Send a text message to a WhatsApp chat. Supports quoting/replying to a specific message.",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Chat JID (e.g. 1234567890@s.whatsapp.net)" },
				text: { type: "string", description: "Message text" },
				quoted_message_id: {
					type: "string",
					description: "Optional: message ID to reply/quote",
				},
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
				emoji: { type: "string", description: "Reaction emoji (empty string to remove)" },
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
	{
		name: "create_poll",
		description: "Create a poll in a WhatsApp chat",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Chat JID" },
				name: { type: "string", description: "Poll question" },
				options: {
					type: "array",
					items: { type: "string" },
					description: "Poll answer options (2-12 items)",
				},
				selectable_count: {
					type: "number",
					description: "Max selections allowed (0 = unlimited, default: 1)",
				},
			},
			required: ["jid", "name", "options"],
		},
	},
	{
		name: "star_message",
		description: "Star or unstar a message",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Chat JID" },
				message_id: { type: "string", description: "Message ID to star/unstar" },
				star: { type: "boolean", description: "true to star, false to unstar" },
			},
			required: ["jid", "message_id", "star"],
		},
	},
]

export async function handleMessagingTool(client: WASocket, args: any): Promise<any> {
	switch (args.toolName) {
		case "send_message": {
			const options: any = {}
			if (args.quoted_message_id) {
				options.quoted = {
					key: { id: args.quoted_message_id, remoteJid: args.jid },
					message: {},
				}
			}
			return client.sendMessage(args.jid, { text: args.text }, options)
		}

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

		case "create_poll":
			return client.sendMessage(args.jid, {
				poll: {
					name: args.name,
					values: args.options,
					selectableCount: args.selectable_count ?? 1,
				},
			})

		case "star_message":
			return client.star(args.jid, [{ id: args.message_id, fromMe: true }])

		default:
			throw new Error(`Unknown messaging tool: ${args.toolName}`)
	}
}
