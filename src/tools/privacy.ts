import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import type { WASocket } from "../client.js"

export const privacyTools: Tool[] = [
	{
		name: "get_privacy_settings",
		description: "Get current privacy settings (last seen, profile photo, about, groups, calls)",
		inputSchema: {
			type: "object",
			properties: {},
		},
	},
	{
		name: "update_last_seen_privacy",
		description: "Control who can see your last seen",
		inputSchema: {
			type: "object",
			properties: {
				value: {
					type: "string",
					description: "Privacy level",
					enum: ["all", "contacts", "contact_blacklist", "none"],
				},
			},
			required: ["value"],
		},
	},
	{
		name: "update_profile_picture_privacy",
		description: "Control who can see your profile picture",
		inputSchema: {
			type: "object",
			properties: {
				value: {
					type: "string",
					description: "Privacy level",
					enum: ["all", "contacts", "contact_blacklist", "none"],
				},
			},
			required: ["value"],
		},
	},
	{
		name: "update_status_privacy",
		description: "Control who can see your status/about",
		inputSchema: {
			type: "object",
			properties: {
				value: {
					type: "string",
					description: "Privacy level",
					enum: ["all", "contacts", "contact_blacklist", "none"],
				},
			},
			required: ["value"],
		},
	},
	{
		name: "update_read_receipts_privacy",
		description: "Control whether others see blue ticks when you read messages",
		inputSchema: {
			type: "object",
			properties: {
				value: {
					type: "string",
					description: "Read receipts setting",
					enum: ["all", "none"],
				},
			},
			required: ["value"],
		},
	},
	{
		name: "update_groups_add_privacy",
		description: "Control who can add you to groups",
		inputSchema: {
			type: "object",
			properties: {
				value: {
					type: "string",
					description: "Who can add you",
					enum: ["all", "contacts", "contact_blacklist"],
				},
			},
			required: ["value"],
		},
	},
	{
		name: "update_online_privacy",
		description: "Control who can see when you are online",
		inputSchema: {
			type: "object",
			properties: {
				value: {
					type: "string",
					description: "Online visibility",
					enum: ["all", "match_last_seen"],
				},
			},
			required: ["value"],
		},
	},
]

export async function handlePrivacyTool(client: WASocket, args: any): Promise<any> {
	switch (args.toolName) {
		case "get_privacy_settings":
			return client.fetchPrivacySettings(true)

		case "update_last_seen_privacy":
			await client.updateLastSeenPrivacy(args.value)
			return { success: true }

		case "update_profile_picture_privacy":
			await client.updateProfilePicturePrivacy(args.value)
			return { success: true }

		case "update_status_privacy":
			await client.updateStatusPrivacy(args.value)
			return { success: true }

		case "update_read_receipts_privacy":
			await client.updateReadReceiptsPrivacy(args.value)
			return { success: true }

		case "update_groups_add_privacy":
			await client.updateGroupsAddPrivacy(args.value)
			return { success: true }

		case "update_online_privacy":
			await client.updateOnlinePrivacy(args.value)
			return { success: true }

		default:
			throw new Error(`Unknown privacy tool: ${args.toolName}`)
	}
}
