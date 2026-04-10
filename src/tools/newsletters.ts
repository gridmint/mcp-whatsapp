import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import type { WASocket } from "../client.js"

export const newsletterTools: Tool[] = [
	{
		name: "create_newsletter",
		description: "Create a new WhatsApp Channel (newsletter)",
		inputSchema: {
			type: "object",
			properties: {
				name: { type: "string", description: "Channel name" },
				description: { type: "string", description: "Channel description (optional)" },
			},
			required: ["name"],
		},
	},
	{
		name: "get_newsletter_info",
		description: "Get metadata about a WhatsApp Channel",
		inputSchema: {
			type: "object",
			properties: {
				jid: {
					type: "string",
					description: "Newsletter JID (e.g. 123456789@newsletter)",
				},
			},
			required: ["jid"],
		},
	},
	{
		name: "follow_newsletter",
		description: "Follow (subscribe to) a WhatsApp Channel",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Newsletter JID" },
			},
			required: ["jid"],
		},
	},
	{
		name: "unfollow_newsletter",
		description: "Unfollow (unsubscribe from) a WhatsApp Channel",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Newsletter JID" },
			},
			required: ["jid"],
		},
	},
	{
		name: "mute_newsletter",
		description: "Mute notifications from a WhatsApp Channel",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Newsletter JID" },
			},
			required: ["jid"],
		},
	},
	{
		name: "unmute_newsletter",
		description: "Unmute notifications from a WhatsApp Channel",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Newsletter JID" },
			},
			required: ["jid"],
		},
	},
]

export async function handleNewsletterTool(client: WASocket, args: any): Promise<any> {
	switch (args.toolName) {
		case "create_newsletter":
			return client.newsletterCreate(args.name, args.description)

		case "get_newsletter_info":
			return client.newsletterMetadata("jid", args.jid)

		case "follow_newsletter":
			await client.newsletterFollow(args.jid)
			return { success: true }

		case "unfollow_newsletter":
			await client.newsletterUnfollow(args.jid)
			return { success: true }

		case "mute_newsletter":
			await client.newsletterMute(args.jid)
			return { success: true }

		case "unmute_newsletter":
			await client.newsletterUnmute(args.jid)
			return { success: true }

		default:
			throw new Error(`Unknown newsletter tool: ${args.toolName}`)
	}
}
