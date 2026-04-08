import { mkdirSync } from "node:fs"
import { join } from "node:path"
import makeWASocket, { DisconnectReason, useMultiFileAuthState, type WASocket } from "baileys"
import {
	AUTH_DIR,
	decryptAuthState,
	encryptAuthState,
	hasEncryptedSession,
	hasPlaintextSession,
} from "./crypto.js"

export async function createWhatsAppClient(): Promise<WASocket> {
	mkdirSync(AUTH_DIR, { recursive: true, mode: 0o700 })

	// Decrypt session files if they exist (encrypted from previous run)
	if (hasEncryptedSession()) {
		try {
			await decryptAuthState()
			console.error("[mcp-whatsapp] Session decrypted (machine-bound)")
		} catch (err: any) {
			console.error(`[mcp-whatsapp] ${err.message}`)
			console.error("[mcp-whatsapp] Scan QR code to create a new session")
			// Clear the invalid encrypted files
			const { readdirSync, unlinkSync } = await import("node:fs")
			for (const f of readdirSync(AUTH_DIR)) {
				unlinkSync(join(AUTH_DIR, f))
			}
		}
	}

	const { state, saveCreds } = await useMultiFileAuthState(AUTH_DIR)

	const sock = makeWASocket({
		auth: state,
		printQRInTerminal: true,
		browser: ["MCP-WhatsApp", "Desktop", "1.0.0"],
		generateHighQualityLinkPreview: true,
	})

	sock.ev.on("creds.update", async () => {
		await saveCreds()
		// Re-encrypt after saving new credentials
		await encryptAuthState()
	})

	sock.ev.on("connection.update", async (update) => {
		const { connection, lastDisconnect } = update

		if (connection === "close") {
			const statusCode = (lastDisconnect?.error as any)?.output?.statusCode
			const shouldReconnect = statusCode !== DisconnectReason.loggedOut

			if (shouldReconnect) {
				console.error("[mcp-whatsapp] Reconnecting...")
				// Encrypt before reconnect attempt
				if (hasPlaintextSession()) {
					await encryptAuthState()
				}
				createWhatsAppClient()
			} else {
				console.error("[mcp-whatsapp] Logged out. Please re-authenticate.")
				process.exit(1)
			}
		}

		if (connection === "open") {
			console.error("[mcp-whatsapp] Connected")
			// Encrypt session after successful connection
			if (hasPlaintextSession()) {
				await encryptAuthState()
				console.error("[mcp-whatsapp] Session encrypted (machine-bound)")
			}
		}
	})

	return sock
}

export type { WASocket }
