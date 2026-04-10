import { describe, expect, it } from "bun:test"
import { RateLimiter } from "../rate-limiter.js"

describe("RateLimiter", () => {
	it("should allow requests within limits", () => {
		const limiter = new RateLimiter({ globalMaxRequests: 5, perJidMaxRequests: 3 })
		expect(() => limiter.check("test@s.whatsapp.net")).not.toThrow()
		expect(() => limiter.check("test@s.whatsapp.net")).not.toThrow()
		expect(() => limiter.check("test@s.whatsapp.net")).not.toThrow()
	})

	it("should block when per-JID limit exceeded", () => {
		const limiter = new RateLimiter({
			globalMaxRequests: 100,
			perJidMaxRequests: 2,
			perJidWindowMs: 1000,
		})
		limiter.check("test@s.whatsapp.net")
		limiter.check("test@s.whatsapp.net")
		expect(() => limiter.check("test@s.whatsapp.net")).toThrow(/Rate limit exceeded/)
	})

	it("should block when global limit exceeded", () => {
		const limiter = new RateLimiter({
			globalMaxRequests: 3,
			globalWindowMs: 1000,
			perJidMaxRequests: 100,
		})
		limiter.check("a@s.whatsapp.net")
		limiter.check("b@s.whatsapp.net")
		limiter.check("c@s.whatsapp.net")
		expect(() => limiter.check("d@s.whatsapp.net")).toThrow(/Rate limit exceeded/)
	})

	it("should allow requests without JID (global only)", () => {
		const limiter = new RateLimiter({ globalMaxRequests: 5 })
		expect(() => limiter.check()).not.toThrow()
		expect(() => limiter.check()).not.toThrow()
	})

	it("should track separate per-JID buckets", () => {
		const limiter = new RateLimiter({
			globalMaxRequests: 100,
			perJidMaxRequests: 1,
			perJidWindowMs: 1000,
		})
		limiter.check("a@s.whatsapp.net")
		expect(() => limiter.check("a@s.whatsapp.net")).toThrow()
		// Different JID should work
		expect(() => limiter.check("b@s.whatsapp.net")).not.toThrow()
	})

	it("should return stats", () => {
		const limiter = new RateLimiter({ globalMaxRequests: 10 })
		limiter.check("a@s.whatsapp.net")
		limiter.check("b@s.whatsapp.net")

		const stats = limiter.stats()
		expect(stats.global.used).toBe(2)
		expect(stats.global.max).toBe(10)
		expect(stats.trackedJids).toBe(2)
	})

	it("should clean up stale buckets", () => {
		const limiter = new RateLimiter({
			globalMaxRequests: 100,
			perJidMaxRequests: 10,
			perJidWindowMs: 1, // 1ms window — expires instantly
		})
		limiter.check("a@s.whatsapp.net")

		// Wait for expiry
		const start = Date.now()
		while (Date.now() - start < 5) {
			/* spin */
		}

		limiter.cleanup()
		expect(limiter.stats().trackedJids).toBe(0)
	})
})
