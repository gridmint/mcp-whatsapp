import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import type { WASocket } from "../client.js"

export const profileTools: Tool[] = [
	{
		name: "update_profile_name",
		description: "Update your WhatsApp display name",
		inputSchema: {
			type: "object",
			properties: {
				name: { type: "string", description: "New display name" },
			},
			required: ["name"],
		},
	},
	{
		name: "update_profile_status",
		description: "Update your about/status text",
		inputSchema: {
			type: "object",
			properties: {
				status: { type: "string", description: "New status text" },
			},
			required: ["status"],
		},
	},
	{
		name: "update_profile_picture",
		description: "Update your profile picture",
		inputSchema: {
			type: "object",
			properties: {
				url: { type: "string", description: "Image URL or local file path" },
			},
			required: ["url"],
		},
	},
	{
		name: "get_business_profile",
		description: "Get the business profile of a WhatsApp Business account",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Contact JID" },
			},
			required: ["jid"],
		},
	},
	{
		name: "create_call_link",
		description: "Create a WhatsApp call link (audio or video)",
		inputSchema: {
			type: "object",
			properties: {
				type: {
					type: "string",
					description: "Call type",
					enum: ["audio", "video"],
				},
			},
			required: ["type"],
		},
	},
	{
		name: "set_disappearing_messages",
		description: "Enable or disable disappearing messages in a chat",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Chat JID" },
				duration: {
					type: "number",
					description: "Duration in seconds (0 = off, 86400 = 24h, 604800 = 7d, 7776000 = 90d)",
				},
			},
			required: ["jid", "duration"],
		},
	},
]

export async function handleProfileTool(client: WASocket, args: any): Promise<any> {
	switch (args.toolName) {
		case "update_profile_name":
			await client.updateProfileName(args.name)
			return { success: true }

		case "update_profile_status":
			await client.updateProfileStatus(args.status)
			return { success: true }

		case "update_profile_picture": {
			const me = client.user?.id
			if (!me) throw new Error("Not connected")
			await client.updateProfilePicture(me, { url: args.url })
			return { success: true }
		}

		case "get_business_profile":
			return client.getBusinessProfile(args.jid)

		case "create_call_link":
			return client.createCallLink(args.type)

		case "set_disappearing_messages":
			return client.sendMessage(args.jid, {
				disappearingMessagesInChat: args.duration === 0 ? false : args.duration,
			})

		default:
			throw new Error(`Unknown profile tool: ${args.toolName}`)
	}
}
