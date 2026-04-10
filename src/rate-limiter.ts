/**
 * Simple sliding-window rate limiter to prevent WhatsApp bans.
 * Tracks message sends per-JID and globally.
 */

interface RateBucket {
	timestamps: number[]
	windowMs: number
	maxRequests: number
}

function createBucket(maxRequests: number, windowMs: number): RateBucket {
	return { timestamps: [], windowMs, maxRequests }
}

function canProceed(bucket: RateBucket): boolean {
	const now = Date.now()
	bucket.timestamps = bucket.timestamps.filter((t) => now - t < bucket.windowMs)
	return bucket.timestamps.length < bucket.maxRequests
}

function record(bucket: RateBucket): void {
	bucket.timestamps.push(Date.now())
}

export class RateLimiter {
	private global: RateBucket
	private perJid: Map<string, RateBucket> = new Map()

	private globalMaxRequests: number
	private globalWindowMs: number
	private perJidMaxRequests: number
	private perJidWindowMs: number

	constructor(options?: {
		globalMaxRequests?: number
		globalWindowMs?: number
		perJidMaxRequests?: number
		perJidWindowMs?: number
	}) {
		this.globalMaxRequests = options?.globalMaxRequests ?? 30
		this.globalWindowMs = options?.globalWindowMs ?? 60_000
		this.perJidMaxRequests = options?.perJidMaxRequests ?? 10
		this.perJidWindowMs = options?.perJidWindowMs ?? 60_000

		this.global = createBucket(this.globalMaxRequests, this.globalWindowMs)
	}

	/**
	 * Check if a request to the given JID is allowed.
	 * If allowed, records the request. If not, throws with retry info.
	 */
	check(jid?: string): void {
		if (!canProceed(this.global)) {
			const oldest = this.global.timestamps[0]
			const retryAfterMs = this.global.windowMs - (Date.now() - oldest)
			throw new Error(
				`Rate limit exceeded (global: ${this.globalMaxRequests}/${this.globalWindowMs / 1000}s). Retry after ${Math.ceil(retryAfterMs / 1000)}s.`,
			)
		}

		if (jid) {
			let bucket = this.perJid.get(jid)
			if (!bucket) {
				bucket = createBucket(this.perJidMaxRequests, this.perJidWindowMs)
				this.perJid.set(jid, bucket)
			}
			if (!canProceed(bucket)) {
				const oldest = bucket.timestamps[0]
				const retryAfterMs = bucket.windowMs - (Date.now() - oldest)
				throw new Error(
					`Rate limit exceeded for ${jid} (${this.perJidMaxRequests}/${this.perJidWindowMs / 1000}s). Retry after ${Math.ceil(retryAfterMs / 1000)}s.`,
				)
			}
			record(bucket)
		}

		record(this.global)
	}

	/** Get current usage stats */
	stats(): { global: { used: number; max: number }; trackedJids: number } {
		const now = Date.now()
		const globalActive = this.global.timestamps.filter((t) => now - t < this.global.windowMs).length

		return {
			global: { used: globalActive, max: this.globalMaxRequests },
			trackedJids: this.perJid.size,
		}
	}

	/** Clean up stale per-JID buckets */
	cleanup(): void {
		const now = Date.now()
		for (const [jid, bucket] of this.perJid) {
			bucket.timestamps = bucket.timestamps.filter((t) => now - t < bucket.windowMs)
			if (bucket.timestamps.length === 0) {
				this.perJid.delete(jid)
			}
		}
	}
}
