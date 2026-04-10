import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import type { WASocket } from "../client.js"

export const groupTools: Tool[] = [
	{
		name: "create_group",
		description: "Create a new WhatsApp group with participants",
		inputSchema: {
			type: "object",
			properties: {
				subject: { type: "string", description: "Group name/subject" },
				participants: {
					type: "array",
					items: { type: "string" },
					description: "Array of participant JIDs to add",
				},
			},
			required: ["subject", "participants"],
		},
	},
	{
		name: "get_group_metadata",
		description: "Get full metadata of a group (subject, description, participants, admins)",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Group JID (e.g. 123456789@g.us)" },
			},
			required: ["jid"],
		},
	},
	{
		name: "update_group_subject",
		description: "Update the name/subject of a group (admin required)",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Group JID" },
				subject: { type: "string", description: "New group name" },
			},
			required: ["jid", "subject"],
		},
	},
	{
		name: "update_group_description",
		description: "Update the description of a group (admin required)",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Group JID" },
				description: { type: "string", description: "New description (empty to clear)" },
			},
			required: ["jid"],
		},
	},
	{
		name: "add_group_members",
		description: "Add members to a group (admin required)",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Group JID" },
				participants: {
					type: "array",
					items: { type: "string" },
					description: "Array of JIDs to add",
				},
			},
			required: ["jid", "participants"],
		},
	},
	{
		name: "remove_group_members",
		description: "Remove members from a group (admin required)",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Group JID" },
				participants: {
					type: "array",
					items: { type: "string" },
					description: "Array of JIDs to remove",
				},
			},
			required: ["jid", "participants"],
		},
	},
	{
		name: "promote_group_admin",
		description: "Promote members to group admin (admin required)",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Group JID" },
				participants: {
					type: "array",
					items: { type: "string" },
					description: "Array of JIDs to promote",
				},
			},
			required: ["jid", "participants"],
		},
	},
	{
		name: "demote_group_admin",
		description: "Demote admins to regular members (admin required)",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Group JID" },
				participants: {
					type: "array",
					items: { type: "string" },
					description: "Array of JIDs to demote",
				},
			},
			required: ["jid", "participants"],
		},
	},
	{
		name: "leave_group",
		description: "Leave a WhatsApp group",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Group JID" },
			},
			required: ["jid"],
		},
	},
	{
		name: "get_group_invite_link",
		description: "Get the invite link for a group (admin required)",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Group JID" },
			},
			required: ["jid"],
		},
	},
	{
		name: "revoke_group_invite",
		description: "Revoke and regenerate the group invite link (admin required)",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Group JID" },
			},
			required: ["jid"],
		},
	},
	{
		name: "join_group_via_invite",
		description: "Join a group using an invite code",
		inputSchema: {
			type: "object",
			properties: {
				code: {
					type: "string",
					description: "Invite code (from link: https://chat.whatsapp.com/CODE)",
				},
			},
			required: ["code"],
		},
	},
	{
		name: "update_group_settings",
		description: "Update group settings: who can send messages and who can edit group info",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Group JID" },
				setting: {
					type: "string",
					description: "Setting to change",
					enum: ["announcement", "not_announcement", "locked", "unlocked"],
				},
			},
			required: ["jid", "setting"],
		},
	},
]

export async function handleGroupTool(client: WASocket, args: any): Promise<any> {
	switch (args.toolName) {
		case "create_group":
			return client.groupCreate(args.subject, args.participants)

		case "get_group_metadata":
			return client.groupMetadata(args.jid)

		case "update_group_subject":
			await client.groupUpdateSubject(args.jid, args.subject)
			return { success: true }

		case "update_group_description":
			await client.groupUpdateDescription(args.jid, args.description || "")
			return { success: true }

		case "add_group_members":
			return client.groupParticipantsUpdate(args.jid, args.participants, "add")

		case "remove_group_members":
			return client.groupParticipantsUpdate(args.jid, args.participants, "remove")

		case "promote_group_admin":
			return client.groupParticipantsUpdate(args.jid, args.participants, "promote")

		case "demote_group_admin":
			return client.groupParticipantsUpdate(args.jid, args.participants, "demote")

		case "leave_group":
			await client.groupLeave(args.jid)
			return { success: true }

		case "get_group_invite_link": {
			const code = await client.groupInviteCode(args.jid)
			return { link: `https://chat.whatsapp.com/${code}`, code }
		}

		case "revoke_group_invite": {
			const newCode = await client.groupRevokeInvite(args.jid)
			return {
				link: newCode ? `https://chat.whatsapp.com/${newCode}` : null,
				code: newCode,
			}
		}

		case "join_group_via_invite": {
			const groupJid = await client.groupAcceptInvite(args.code)
			return { jid: groupJid }
		}

		case "update_group_settings":
			await client.groupSettingUpdate(args.jid, args.setting)
			return { success: true }

		default:
			throw new Error(`Unknown group tool: ${args.toolName}`)
	}
}
