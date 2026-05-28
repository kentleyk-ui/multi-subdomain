// Caching strategy for Phase 7: Optimizations

const CACHE_STRATEGIES = {
  // Static content (1 year)
  STATIC: 60 * 60 * 24 * 365,
  // Assets (1 month)
  ASSETS: 60 * 60 * 24 * 30,
  // API data (5 minutes)
  API_SHORT: 60 * 5,
  // API data (1 hour)
  API_LONG: 60 * 60,
  // Dashboard stats (2 minutes)
  DASHBOARD: 60 * 2,
  // No cache
  NO_CACHE: 0,
}

class CacheManager {
  constructor() {
    this.cache = new Map()
    this.timers = new Map()
  }

  set(key, value, ttl = CACHE_STRATEGIES.API_SHORT) {
    // Clear existing timer
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key))
    }

    this.cache.set(key, value)

    // Set expiration timer
    if (ttl > 0) {
      const timer = setTimeout(() => {
        this.cache.delete(key)
        this.timers.delete(key)
      }, ttl * 1000)

      this.timers.set(key, timer)
    }

    return value
  }

  get(key) {
    return this.cache.get(key)
  }

  has(key) {
    return this.cache.has(key)
  }

  delete(key) {
    if (this.timers.has(key)) {
      clearTimeout(this.timers.get(key))
      this.timers.delete(key)
    }
    return this.cache.delete(key)
  }

  clear() {
    for (const timer of this.timers.values()) {
      clearTimeout(timer)
    }
    this.cache.clear()
    this.timers.clear()
  }

  getOrSet(key, fetcher, ttl) {
    if (this.has(key)) {
      return Promise.resolve(this.get(key))
    }

    return fetcher().then(value => {
      this.set(key, value, ttl)
      return value
    })
  }

  // Cache invalidation patterns
  invalidatePattern(pattern) {
    for (const key of this.cache.keys()) {
      if (key.includes(pattern)) {
        this.delete(key)
      }
    }
  }

  getStats() {
    return {
      size: this.cache.size,
      keys: Array.from(this.cache.keys()),
    }
  }
}

// Export singleton instance
module.exports = {
  CACHE_STRATEGIES,
  CacheManager,
  cacheManager: new CacheManager(),
}
