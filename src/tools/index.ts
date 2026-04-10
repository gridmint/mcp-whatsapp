import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import type { WASocket } from "../client.js"
import { RateLimiter } from "../rate-limiter.js"
import { chatTools, handleChatTool } from "./chats.js"
import { communityTools, handleCommunityTool } from "./communities.js"
import { contactTools, handleContactTool } from "./contacts.js"
import { groupTools, handleGroupTool } from "./groups.js"
import { handleLabelTool, labelTools } from "./labels.js"
import { handleMediaTool, mediaTools } from "./media.js"
import { handleMessagingTool, messagingTools } from "./messaging.js"
import { handleNewsletterTool, newsletterTools } from "./newsletters.js"
import { handlePrivacyTool, privacyTools } from "./privacy.js"
import { handleProfileTool, profileTools } from "./profile.js"
import { createStatusHandler, statusTools } from "./status.js"

// Write operations that count toward rate limits
const WRITE_TOOLS = new Set([
	"send_message",
	"send_image",
	"send_document",
	"send_reaction",
	"delete_message",
	"edit_message",
	"forward_message",
	"create_poll",
	"star_message",
	"send_video",
	"send_sticker",
	"send_voice",
	"send_audio",
	"send_location",
	"send_contact",
	"create_group",
	"add_group_members",
	"remove_group_members",
	"promote_group_admin",
	"demote_group_admin",
	"create_newsletter",
	"create_community",
	"community_add_members",
	"community_remove_members",
])

const rateLimiter = new RateLimiter()
const handleStatusTool = createStatusHandler(rateLimiter)

// Periodic cleanup of stale rate limit buckets
setInterval(() => rateLimiter.cleanup(), 5 * 60_000)

const allTools: Tool[] = [
	...messagingTools,
	...chatTools,
	...contactTools,
	...groupTools,
	...mediaTools,
	...newsletterTools,
	...privacyTools,
	...communityTools,
	...labelTools,
	...profileTools,
	...statusTools,
]

export function getTools(): Tool[] {
	return allTools
}

export async function handleToolCall(
	client: WASocket,
	name: string,
	args: any,
): Promise<{ content: Array<{ type: string; text: string }> }> {
	// Rate limit write operations
	if (WRITE_TOOLS.has(name)) {
		try {
			const jid = args?.jid || args?.to_jid
			rateLimiter.check(jid)
		} catch (error: any) {
			return {
				content: [{ type: "text", text: `Rate limited: ${error.message}` }],
			}
		}
	}

	const toolSets = [
		{ tools: messagingTools, handler: handleMessagingTool },
		{ tools: chatTools, handler: handleChatTool },
		{ tools: contactTools, handler: handleContactTool },
		{ tools: groupTools, handler: handleGroupTool },
		{ tools: mediaTools, handler: handleMediaTool },
		{ tools: newsletterTools, handler: handleNewsletterTool },
		{ tools: privacyTools, handler: handlePrivacyTool },
		{ tools: communityTools, handler: handleCommunityTool },
		{ tools: labelTools, handler: handleLabelTool },
		{ tools: profileTools, handler: handleProfileTool },
		{ tools: statusTools, handler: handleStatusTool },
	]

	for (const { tools, handler } of toolSets) {
		if (tools.some((t) => t.name === name)) {
			try {
				const result = await handler(client, { toolName: name, ...args })
				return {
					content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
				}
			} catch (error: any) {
				return {
					content: [{ type: "text", text: `Error: ${error.message}` }],
				}
			}
		}
	}

	return {
		content: [{ type: "text", text: `Unknown tool: ${name}` }],
	}
}
