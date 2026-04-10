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

	it("should have 76 tools", () => {
		const tools = getTools()
		expect(tools.length).toBe(76)
	})

	it("should have all tool categories", () => {
		const tools = getTools()
		const names = tools.map((t) => t.name)

		// Messaging
		expect(names).toContain("send_message")
		expect(names).toContain("create_poll")
		expect(names).toContain("star_message")

		// Chats
		expect(names).toContain("list_chats")
		expect(names).toContain("archive_chat")

		// Contacts
		expect(names).toContain("check_number")
		expect(names).toContain("set_presence")

		// Groups
		expect(names).toContain("create_group")
		expect(names).toContain("get_group_metadata")
		expect(names).toContain("add_group_members")
		expect(names).toContain("leave_group")
		expect(names).toContain("update_group_settings")

		// Media
		expect(names).toContain("send_video")
		expect(names).toContain("send_sticker")
		expect(names).toContain("send_voice")
		expect(names).toContain("send_location")
		expect(names).toContain("send_contact")

		// Newsletters
		expect(names).toContain("create_newsletter")
		expect(names).toContain("follow_newsletter")

		// Privacy
		expect(names).toContain("get_privacy_settings")
		expect(names).toContain("update_last_seen_privacy")
		expect(names).toContain("update_online_privacy")

		// Communities (v0.3.0)
		expect(names).toContain("create_community")
		expect(names).toContain("get_community_metadata")
		expect(names).toContain("community_fetch_groups")
		expect(names).toContain("community_create_group")
		expect(names).toContain("community_link_group")
		expect(names).toContain("leave_community")

		// Labels (v0.3.0)
		expect(names).toContain("add_chat_label")
		expect(names).toContain("remove_chat_label")
		expect(names).toContain("add_message_label")
		expect(names).toContain("remove_message_label")

		// Profile (v0.3.0)
		expect(names).toContain("update_profile_name")
		expect(names).toContain("update_profile_status")
		expect(names).toContain("update_profile_picture")
		expect(names).toContain("get_business_profile")
		expect(names).toContain("create_call_link")
		expect(names).toContain("set_disappearing_messages")
	})

	it("all tools should have valid inputSchema", () => {
		const tools = getTools()
		for (const tool of tools) {
			expect(tool.inputSchema).toBeDefined()
			expect(tool.inputSchema.type).toBe("object")
			expect(tool.name).toBeTruthy()
			expect(tool.description).toBeTruthy()
		}
	})

	it("all tools with required params should define them in properties", () => {
		const tools = getTools()
		for (const tool of tools) {
			const required = (tool.inputSchema as any).required || []
			const properties = (tool.inputSchema as any).properties || {}
			for (const param of required) {
				expect(properties[param]).toBeDefined()
			}
		}
	})
})
