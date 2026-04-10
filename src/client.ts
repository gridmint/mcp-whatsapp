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

const MAX_RECONNECT_ATTEMPTS = 10
const INITIAL_BACKOFF_MS = 1_000
const MAX_BACKOFF_MS = 60_000

let reconnectAttempts = 0
let connectionState: "connecting" | "open" | "closed" = "connecting"

export function getConnectionState(): string {
	return connectionState
}

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
			connectionState = "closed"
			const statusCode = (lastDisconnect?.error as any)?.output?.statusCode
			const shouldReconnect = statusCode !== DisconnectReason.loggedOut

			if (shouldReconnect && reconnectAttempts < MAX_RECONNECT_ATTEMPTS) {
				reconnectAttempts++
				const backoff = Math.min(INITIAL_BACKOFF_MS * 2 ** (reconnectAttempts - 1), MAX_BACKOFF_MS)
				console.error(
					`[mcp-whatsapp] Reconnecting (attempt ${reconnectAttempts}/${MAX_RECONNECT_ATTEMPTS}) in ${backoff / 1000}s...`,
				)

				// Encrypt before reconnect attempt
				if (hasPlaintextSession()) {
					await encryptAuthState()
				}

				await new Promise((r) => setTimeout(r, backoff))
				connectionState = "connecting"
				createWhatsAppClient()
			} else if (!shouldReconnect) {
				console.error("[mcp-whatsapp] Logged out. Please re-authenticate.")
				process.exit(1)
			} else {
				console.error(
					`[mcp-whatsapp] Max reconnect attempts (${MAX_RECONNECT_ATTEMPTS}) reached. Exiting.`,
				)
				process.exit(1)
			}
		}

		if (connection === "open") {
			connectionState = "open"
			reconnectAttempts = 0
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
