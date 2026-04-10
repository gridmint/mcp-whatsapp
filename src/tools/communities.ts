import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import type { WASocket } from "../client.js"

export const communityTools: Tool[] = [
	{
		name: "create_community",
		description: "Create a new WhatsApp Community with a name and description",
		inputSchema: {
			type: "object",
			properties: {
				subject: { type: "string", description: "Community name" },
				description: { type: "string", description: "Community description" },
			},
			required: ["subject", "description"],
		},
	},
	{
		name: "get_community_metadata",
		description: "Get metadata of a community (name, description, linked groups)",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Community JID" },
			},
			required: ["jid"],
		},
	},
	{
		name: "community_fetch_groups",
		description: "Fetch all groups linked to a community",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Community JID" },
			},
			required: ["jid"],
		},
	},
	{
		name: "community_create_group",
		description: "Create a new group inside a community",
		inputSchema: {
			type: "object",
			properties: {
				subject: { type: "string", description: "Group name" },
				participants: {
					type: "array",
					items: { type: "string" },
					description: "Participant JIDs",
				},
				community_jid: { type: "string", description: "Parent community JID" },
			},
			required: ["subject", "participants", "community_jid"],
		},
	},
	{
		name: "community_link_group",
		description: "Link an existing group to a community",
		inputSchema: {
			type: "object",
			properties: {
				group_jid: { type: "string", description: "Group JID to link" },
				community_jid: { type: "string", description: "Community JID" },
			},
			required: ["group_jid", "community_jid"],
		},
	},
	{
		name: "community_unlink_group",
		description: "Unlink a group from a community",
		inputSchema: {
			type: "object",
			properties: {
				group_jid: { type: "string", description: "Group JID to unlink" },
				community_jid: { type: "string", description: "Community JID" },
			},
			required: ["group_jid", "community_jid"],
		},
	},
	{
		name: "community_update_subject",
		description: "Update the name of a community",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Community JID" },
				subject: { type: "string", description: "New community name" },
			},
			required: ["jid", "subject"],
		},
	},
	{
		name: "community_update_description",
		description: "Update the description of a community",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Community JID" },
				description: { type: "string", description: "New description" },
			},
			required: ["jid"],
		},
	},
	{
		name: "leave_community",
		description: "Leave a community",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Community JID" },
			},
			required: ["jid"],
		},
	},
	{
		name: "community_add_members",
		description: "Add members to a community",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Community JID" },
				participants: {
					type: "array",
					items: { type: "string" },
					description: "JIDs to add",
				},
			},
			required: ["jid", "participants"],
		},
	},
	{
		name: "community_remove_members",
		description: "Remove members from a community",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Community JID" },
				participants: {
					type: "array",
					items: { type: "string" },
					description: "JIDs to remove",
				},
			},
			required: ["jid", "participants"],
		},
	},
]

export async function handleCommunityTool(client: WASocket, args: any): Promise<any> {
	switch (args.toolName) {
		case "create_community":
			return client.communityCreate(args.subject, args.description)

		case "get_community_metadata":
			return client.communityMetadata(args.jid)

		case "community_fetch_groups":
			return client.communityFetchLinkedGroups(args.jid)

		case "community_create_group":
			return client.communityCreateGroup(args.subject, args.participants, args.community_jid)

		case "community_link_group":
			await client.communityLinkGroup(args.group_jid, args.community_jid)
			return { success: true }

		case "community_unlink_group":
			await client.communityUnlinkGroup(args.group_jid, args.community_jid)
			return { success: true }

		case "community_update_subject":
			await client.communityUpdateSubject(args.jid, args.subject)
			return { success: true }

		case "community_update_description":
			await client.communityUpdateDescription(args.jid, args.description)
			return { success: true }

		case "leave_community":
			await client.communityLeave(args.jid)
			return { success: true }

		case "community_add_members":
			return client.communityParticipantsUpdate(args.jid, args.participants, "add")

		case "community_remove_members":
			return client.communityParticipantsUpdate(args.jid, args.participants, "remove")

		default:
			throw new Error(`Unknown community tool: ${args.toolName}`)
	}
}
