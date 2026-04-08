import { afterAll, beforeAll, describe, expect, it } from "bun:test"
import { mkdirSync, rmSync } from "node:fs"
import { tmpdir } from "node:os"
import { join } from "node:path"

// We test the core encrypt/decrypt logic directly
describe("crypto", () => {
	const testDir = join(tmpdir(), `mcp-wa-test-${Date.now()}`)

	beforeAll(() => {
		mkdirSync(testDir, { recursive: true })
	})

	afterAll(() => {
		rmSync(testDir, { recursive: true, force: true })
	})

	it("should encrypt and decrypt data using Web Crypto", async () => {
		// Simulate the encryption flow
		const machineId = "test-machine-id-12345"
		const data = new TextEncoder().encode('{"key": "secret-session-data"}')

		// Derive key
		const keyMaterial = await crypto.subtle.importKey(
			"raw",
			new TextEncoder().encode(machineId),
			"HKDF",
			false,
			["deriveKey"],
		)
		const key = await crypto.subtle.deriveKey(
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

		// Encrypt
		const iv = crypto.getRandomValues(new Uint8Array(12))
		const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data)
		const combined = new Uint8Array(12 + encrypted.byteLength)
		combined.set(iv, 0)
		combined.set(new Uint8Array(encrypted), 12)

		// Decrypt
		const decIv = combined.slice(0, 12)
		const decData = combined.slice(12)
		const decrypted = await crypto.subtle.decrypt({ name: "AES-GCM", iv: decIv }, key, decData)

		expect(new TextDecoder().decode(decrypted)).toBe('{"key": "secret-session-data"}')
	})

	it("should fail decryption with wrong machine id", async () => {
		const data = new TextEncoder().encode("secret")

		// Encrypt with machine A
		const keyMatA = await crypto.subtle.importKey(
			"raw",
			new TextEncoder().encode("machine-A"),
			"HKDF",
			false,
			["deriveKey"],
		)
		const keyA = await crypto.subtle.deriveKey(
			{
				name: "HKDF",
				hash: "SHA-256",
				salt: new TextEncoder().encode("mcp-whatsapp-session"),
				info: new TextEncoder().encode("aes-256-gcm-key"),
			},
			keyMatA,
			{ name: "AES-GCM", length: 256 },
			false,
			["encrypt", "decrypt"],
		)
		const iv = crypto.getRandomValues(new Uint8Array(12))
		const encrypted = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, keyA, data)
		const combined = new Uint8Array(12 + encrypted.byteLength)
		combined.set(iv, 0)
		combined.set(new Uint8Array(encrypted), 12)

		// Try decrypt with machine B
		const keyMatB = await crypto.subtle.importKey(
			"raw",
			new TextEncoder().encode("machine-B"),
			"HKDF",
			false,
			["deriveKey"],
		)
		const keyB = await crypto.subtle.deriveKey(
			{
				name: "HKDF",
				hash: "SHA-256",
				salt: new TextEncoder().encode("mcp-whatsapp-session"),
				info: new TextEncoder().encode("aes-256-gcm-key"),
			},
			keyMatB,
			{ name: "AES-GCM", length: 256 },
			false,
			["encrypt", "decrypt"],
		)

		const decIv = combined.slice(0, 12)
		const decData = combined.slice(12)

		expect(crypto.subtle.decrypt({ name: "AES-GCM", iv: decIv }, keyB, decData)).rejects.toThrow()
	})
})
