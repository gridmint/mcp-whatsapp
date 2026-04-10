import { readFile } from "node:fs/promises"
import type { Tool } from "@modelcontextprotocol/sdk/types.js"
import type { WASocket } from "../client.js"

export const mediaTools: Tool[] = [
	{
		name: "send_video",
		description: "Send a video to a WhatsApp chat",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Chat JID" },
				url: { type: "string", description: "Video URL or local file path" },
				caption: { type: "string", description: "Optional caption" },
				gif_playback: {
					type: "boolean",
					description: "Send as GIF (auto-play, no sound). Default: false",
				},
			},
			required: ["jid", "url"],
		},
	},
	{
		name: "send_sticker",
		description: "Send a sticker to a WhatsApp chat",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Chat JID" },
				url: {
					type: "string",
					description: "Sticker image URL or local file path (WebP recommended)",
				},
			},
			required: ["jid", "url"],
		},
	},
	{
		name: "send_voice",
		description: "Send a voice message (appears as voice note with waveform)",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Chat JID" },
				url: { type: "string", description: "Audio file URL or local path (OGG Opus recommended)" },
			},
			required: ["jid", "url"],
		},
	},
	{
		name: "send_audio",
		description: "Send an audio file (appears as playable audio, not voice note)",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Chat JID" },
				url: { type: "string", description: "Audio file URL or local path" },
			},
			required: ["jid", "url"],
		},
	},
	{
		name: "send_location",
		description: "Send a location pin to a WhatsApp chat",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Chat JID" },
				latitude: { type: "number", description: "Latitude" },
				longitude: { type: "number", description: "Longitude" },
				name: { type: "string", description: "Location name (optional)" },
				address: { type: "string", description: "Address text (optional)" },
			},
			required: ["jid", "latitude", "longitude"],
		},
	},
	{
		name: "send_contact",
		description: "Send a contact card (vCard) to a WhatsApp chat",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Chat JID" },
				name: { type: "string", description: "Contact display name" },
				phone: { type: "string", description: "Phone number with country code" },
			},
			required: ["jid", "name", "phone"],
		},
	},
	{
		name: "download_media",
		description: "Download media from a received message. Returns base64-encoded content.",
		inputSchema: {
			type: "object",
			properties: {
				jid: { type: "string", description: "Chat JID where the message is" },
				message_id: { type: "string", description: "Message ID containing media" },
			},
			required: ["jid", "message_id"],
		},
	},
]

function isLocalPath(url: string): boolean {
	return url.startsWith("/") || url.startsWith("./") || url.startsWith("~")
}

async function resolveMedia(url: string): Promise<{ url: string } | Buffer> {
	if (isLocalPath(url)) {
		return readFile(url.replace(/^~/, process.env.HOME || ""))
	}
	return { url }
}

export async function handleMediaTool(client: WASocket, args: any): Promise<any> {
	switch (args.toolName) {
		case "send_video": {
			const source = await resolveMedia(args.url)
			return client.sendMessage(args.jid, {
				video: source,
				caption: args.caption,
				gifPlayback: args.gif_playback || false,
			})
		}

		case "send_sticker": {
			const source = await resolveMedia(args.url)
			return client.sendMessage(args.jid, {
				sticker: source,
			})
		}

		case "send_voice": {
			const source = await resolveMedia(args.url)
			return client.sendMessage(args.jid, {
				audio: source,
				ptt: true,
			})
		}

		case "send_audio": {
			const source = await resolveMedia(args.url)
			return client.sendMessage(args.jid, {
				audio: source,
				ptt: false,
			})
		}

		case "send_location":
			return client.sendMessage(args.jid, {
				location: {
					degreesLatitude: args.latitude,
					degreesLongitude: args.longitude,
					name: args.name,
					address: args.address,
				},
			})

		case "send_contact": {
			const vcard = [
				"BEGIN:VCARD",
				"VERSION:3.0",
				`FN:${args.name}`,
				`TEL;type=CELL;type=VOICE;waid=${args.phone.replace(/[^\d]/g, "")}:${args.phone}`,
				"END:VCARD",
			].join("\n")

			return client.sendMessage(args.jid, {
				contacts: {
					displayName: args.name,
					contacts: [{ displayName: args.name, vcard }],
				},
			})
		}

		case "download_media":
			// This requires the message object — caller needs to fetch it first
			// For now, return instructions. A real implementation would use the store.
			return {
				error:
					"download_media requires message store integration. Use read_messages to get message content, then reference the media URL directly.",
			}

		default:
			throw new Error(`Unknown media tool: ${args.toolName}`)
	}
}
