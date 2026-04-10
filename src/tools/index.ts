import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import type { WASocket } from "../client.js"
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
]

export function getTools(): Tool[] {
	return allTools
}

export async function handleToolCall(
	client: WASocket,
	name: string,
	args: any,
): Promise<{ content: Array<{ type: string; text: string }> }> {
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
