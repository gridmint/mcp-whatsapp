import { existsSync, readdirSync, readFileSync, unlinkSync, writeFileSync } from "node:fs"
import { homedir } from "node:os"
import { join } from "node:path"
import { machineIdSync } from "node-machine-id"

const AUTH_DIR = join(homedir(), ".mcp-whatsapp", "auth")

function getMachineId(): string {
	// node-machine-id handles Linux, macOS, Windows, FreeBSD
	// with proper fallbacks per OS version
	return machineIdSync(true)
}

async function deriveKey(machineId: string): Promise<CryptoKey> {
	const keyMaterial = await crypto.subtle.importKey(
		"raw",
		new TextEncoder().encode(machineId),
		"HKDF",
		false,
		["deriveKey"],
	)

	return crypto.subtle.deriveKey(
		{
			name: "HKDF",
			hash: "SHA-256",
			salt: new TextEncoder().encode("mcp-whatsapp-session"),
			info: new TextEncoder().encode("aes-256-gcm-key"),
		},
		keyMaterial,
		{ name: "AES-GCM", length: 256 },
		false,
		["encrypt", "decrypt"],
	)
}

async function encrypt(key: CryptoKey, data: Uint8Array): Promise<Uint8Array> {
	const iv = crypto.getRandomValues(new Uint8Array(12))
	const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data)
	// Format: [12 bytes IV][encrypted data with auth tag]
	const result = new Uint8Array(12 + encrypted.byteLength)
	result.set(iv, 0)
	result.set(new Uint8Array(encrypted), 12)
	return result
}

async function decrypt(key: CryptoKey, data: Uint8Array): Promise<Uint8Array> {
	const iv = data.slice(0, 12)
	const encrypted = data.slice(12)
	const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, encrypted)
	return new Uint8Array(decrypted)
}

let _key: CryptoKey | null = null

async function getKey(): Promise<CryptoKey> {
	if (!_key) {
		const machineId = getMachineId()
		_key = await deriveKey(machineId)
	}
	return _key
}

export async function encryptFile(path: string): Promise<void> {
	const key = await getKey()
	const data = readFileSync(path)
	const encrypted = await encrypt(key, data)
	writeFileSync(`${path}.enc`, encrypted, { mode: 0o600 })
}

export async function decryptFile(path: string): Promise<Buffer> {
	const key = await getKey()
	const data = readFileSync(path)
	const decrypted = await decrypt(key, data)
	return Buffer.from(decrypted)
}

export async function encryptAuthState(): Promise<void> {
	if (!existsSync(AUTH_DIR)) return
	const files = readdirSync(AUTH_DIR).filter((f) => !f.endsWith(".enc"))
	for (const file of files) {
		const filePath = join(AUTH_DIR, file)
		await encryptFile(filePath)
		// Remove plaintext after encryption
		unlinkSync(filePath)
	}
}

export async function decryptAuthState(): Promise<void> {
	if (!existsSync(AUTH_DIR)) return
	const files = readdirSync(AUTH_DIR).filter((f) => f.endsWith(".enc"))
	for (const file of files) {
		const filePath = join(AUTH_DIR, file)
		try {
			const decrypted = await decryptFile(filePath)
			const originalPath = filePath.replace(/\.enc$/, "")
			writeFileSync(originalPath, decrypted, { mode: 0o600 })
		} catch {
			// Decryption failed — wrong machine, session invalid
			throw new Error(
				"Failed to decrypt session. This session was created on a different machine. Please re-authenticate with QR code.",
			)
		}
	}
}

export function hasEncryptedSession(): boolean {
	if (!existsSync(AUTH_DIR)) return false
	return readdirSync(AUTH_DIR).some((f) => f.endsWith(".enc"))
}

export function hasPlaintextSession(): boolean {
	if (!existsSync(AUTH_DIR)) return false
	return readdirSync(AUTH_DIR).some((f) => !f.endsWith(".enc") && !f.startsWith("."))
}

export { AUTH_DIR }
