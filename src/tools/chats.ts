import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import type { WASocket } from "../client.js"

export const chatTools: Tool[] = [
	{
		name: "list_chats",
		description: "List all WhatsApp chats/conversations",
		inputSchema: {
			type: "object",
			properties: {
				limit: { type: "number", description: "Max chats to return (default: 20)" },
			},
		},
	},
	{
		name: "get_chat_info",
		description: "Get info about a chat (group or contact)",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Chat JID" },
			},
			required: ["jid"],
		},
	},
	{
		name: "search_messages",
		description: "Search messages across chats",
		inputSchema: {
			type: "object",
			properties: {
				query: { type: "string", description: "Search query" },
				jid: { type: "string", description: "Optional: limit search to specific chat" },
				limit: { type: "number", description: "Max results (default: 20)" },
			},
			required: ["query"],
		},
	},
	{
		name: "archive_chat",
		description: "Archive or unarchive a chat",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Chat JID" },
				archive: { type: "boolean", description: "true to archive, false to unarchive" },
			},
			required: ["jid", "archive"],
		},
	},
	{
		name: "mute_chat",
		description: "Mute or unmute a chat",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Chat JID" },
				duration: { type: "number", description: "Mute duration in seconds (0 = unmute)" },
			},
			required: ["jid", "duration"],
		},
	},
	{
		name: "pin_chat",
		description: "Pin or unpin a chat",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Chat JID" },
				pin: { type: "boolean", description: "true to pin, false to unpin" },
			},
			required: ["jid", "pin"],
		},
	},
	{
		name: "mark_as_read",
		description: "Mark all messages in a chat as read",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Chat JID" },
			},
			required: ["jid"],
		},
	},
]

export async function handleChatTool(client: WASocket, args: any): Promise<any> {
	switch (args.toolName) {
		case "list_chats": {
			const chats = await client.groupFetchAllParticipating()
			return Object.keys(chats).slice(0, args.limit || 20)
		}

		case "get_chat_info": {
			if (args.jid.endsWith("@g.us")) {
				return client.groupMetadata(args.jid)
			}
			return { jid: args.jid, type: "contact" }
		}

		case "archive_chat":
			return client.chatModify({ archive: args.archive }, args.jid)

		case "mute_chat":
			return client.chatModify(
				{ mute: args.duration > 0 ? Date.now() + args.duration * 1000 : null },
				args.jid,
			)

		case "pin_chat":
			return client.chatModify({ pin: args.pin }, args.jid)

		case "mark_as_read":
			return client.readMessages([{ id: "all", remoteJid: args.jid }])

		default:
			throw new Error(`Unknown chat tool: ${args.toolName}`)
	}
}
