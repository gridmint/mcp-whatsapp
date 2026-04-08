import { describe, expect, it } from "bun:test"
import { getTools } from "../tools/index.js"

describe("mcp-whatsapp", () => {
	it("should export tools", () => {
		const tools = getTools()
		expect(tools.length).toBeGreaterThan(0)
	})

	it("should have unique tool names", () => {
		const tools = getTools()
		const names = tools.map((t) => t.name)
		const unique = new Set(names)
		expect(unique.size).toBe(names.length)
	})

	it("should have 20 tools", () => {
		const tools = getTools()
		expect(tools.length).toBe(20)
	})
})
