import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import type { WASocket } from "../client.js"

export const contactTools: Tool[] = [
	{
		name: "check_number",
		description: "Check if a phone number is registered on WhatsApp",
		inputSchema: {
			type: "object",
			properties: {
				phone: { type: "string", description: "Phone number with country code (e.g. +1234567890)" },
			},
			required: ["phone"],
		},
	},
	{
		name: "get_profile_picture",
		description: "Get profile picture URL of a contact or group",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Contact or group JID" },
			},
			required: ["jid"],
		},
	},
	{
		name: "get_status",
		description: "Get the status/about text of a contact",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Contact JID" },
			},
			required: ["jid"],
		},
	},
	{
		name: "block_contact",
		description: "Block or unblock a contact",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Contact JID" },
				block: { type: "boolean", description: "true to block, false to unblock" },
			},
			required: ["jid", "block"],
		},
	},
	{
		name: "set_presence",
		description: "Set your presence (online/offline/typing)",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Chat JID (for typing indicator)" },
				presence: {
					type: "string",
					description: "Presence type",
					enum: ["available", "unavailable", "composing", "recording", "paused"],
				},
			},
			required: ["presence"],
		},
	},
]

export async function handleContactTool(client: WASocket, args: any): Promise<any> {
	switch (args.toolName) {
		case "check_number": {
			const phone = args.phone.replace(/[^\d]/g, "")
			const [result] = await client.onWhatsApp(phone)
			return result || { exists: false, phone }
		}

		case "get_profile_picture": {
			const url = await client.profilePictureUrl(args.jid, "image")
			return { jid: args.jid, url }
		}

		case "get_status": {
			const status = await client.fetchStatus(args.jid)
			return status
		}

		case "block_contact":
			return client.updateBlockStatus(args.jid, args.block ? "block" : "unblock")

		case "set_presence":
			if (args.jid) {
				return client.sendPresenceUpdate(args.presence, args.jid)
			}
			return client.sendPresenceUpdate(args.presence)

		default:
			throw new Error(`Unknown contact tool: ${args.toolName}`)
	}
}
