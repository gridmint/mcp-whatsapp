import { homedir } from "node:os"
import { join } from "node:path"
import makeWASocket, { DisconnectReason, useMultiFileAuthState, type WASocket } from "baileys"

const AUTH_DIR = join(homedir(), ".mcp-whatsapp", "auth")

export async function createWhatsAppClient(): Promise<WASocket> {
	const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR)

	const sock = makeWASocket({
		auth: state,
		printQRInTerminal: true,
		browser: ["MCP-WhatsApp", "Desktop", "1.0.0"],
		generateHighQualityLinkPreview: true,
	})

	sock.ev.on("creds.update", saveCreds)

	sock.ev.on("connection.update", (update) => {
		const { connection, lastDisconnect } = update

		if (connection === "close") {
			const statusCode = (lastDisconnect?.error as any)?.output?.statusCode
			const shouldReconnect = statusCode !== DisconnectReason.loggedOut

			if (shouldReconnect) {
				console.error("[mcp-whatsapp] Reconnecting...")
				createWhatsAppClient()
			} else {
				console.error("[mcp-whatsapp] Logged out. Please re-authenticate.")
				process.exit(1)
			}
		}

		if (connection === "open") {
			console.error("[mcp-whatsapp] Connected")
		}
	})

	return sock
}

export type { WASocket }
