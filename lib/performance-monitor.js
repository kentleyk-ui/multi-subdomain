// Performance monitoring and metrics collection for Phase 7

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map()
    this.thresholds = {
      API_RESPONSE: 500, // ms
      PAGE_LOAD: 3000, // ms
      SLOW_QUERY: 1000, // ms
    }
  }

  recordMetric(name, duration, metadata = {}) {
    if (!this.metrics.has(name)) {
      this.metrics.set(name, [])
    }

    const metric = {
      duration,
      timestamp: Date.now(),
      slow: duration > this.thresholds[name],
      ...metadata,
    }

    this.metrics.get(name).push(metric)

    // Keep only last 1000 metrics per type
    if (this.metrics.get(name).length > 1000) {
      this.metrics.get(name).shift()
    }

    return metric
  }

  getMetrics(name) {
    return this.metrics.get(name) || []
  }

  getStats(name) {
    const metrics = this.getMetrics(name)
    if (metrics.length === 0) return null

    const durations = metrics.map(m => m.duration)
    const sum = durations.reduce((a, b) => a + b, 0)
    const avg = sum / durations.length

    return {
      count: metrics.length,
      min: Math.min(...durations),
      max: Math.max(...durations),
      avg: Math.round(avg),
      median: this.getMedian(durations),
      slowCount: metrics.filter(m => m.slow).length,
      slowPercentage: Math.round((metrics.filter(m => m.slow).length / metrics.length) * 100),
    }
  }

  getMedian(arr) {
    const sorted = [...arr].sort((a, b) => a - b)
    const mid = Math.floor(sorted.length / 2)
    return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2
  }

  getAllStats() {
    const stats = {}
    for (const [name] of this.metrics) {
      stats[name] = this.getStats(name)
    }
    return stats
  }

  clear(name) {
    if (name) {
      this.metrics.delete(name)
    } else {
      this.metrics.clear()
    }
  }

  // Middleware for API endpoints
  middleware(name) {
    return (req, res, next) => {
      const start = Date.now()
      const originalJson = res.json

      res.json = function(data) {
        const duration = Date.now() - start
        this.recordMetric(name, duration, {
          method: req.method,
          endpoint: req.url,
          statusCode: res.statusCode,
        })
        return originalJson.call(this, data)
      }.bind(this)

      next()
    }
  }
}

// Export singleton instance
const monitor = new PerformanceMonitor()
module.exports = monitor
