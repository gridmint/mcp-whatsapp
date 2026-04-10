import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import type { WASocket } from "../client.js"
import { getConnectionState } from "../client.js"
import type { RateLimiter } from "../rate-limiter.js"

export const statusTools: Tool[] = [
	{
		name: "get_connection_status",
		description: "Get current WhatsApp connection status and rate limit usage",
		inputSchema: {
			type: "object",
			properties: {},
		},
	},
]

export function createStatusHandler(rateLimiter: RateLimiter) {
	return async (_client: WASocket, args: any): Promise<any> => {
		switch (args.toolName) {
			case "get_connection_status":
				return {
					connection: getConnectionState(),
					rateLimiter: rateLimiter.stats(),
				}
			default:
				throw new Error(`Unknown status tool: ${args.toolName}`)
		}
	}
}
