// Advanced analytics engine - Phase 8

class AnalyticsEngine {
  constructor() {
    this.events = []
    this.sessions = new Map()
    this.cohorts = new Map()
    this.funnels = new Map()
  }

  trackEvent(eventName, userId, properties = {}) {
    const event = {
      name: eventName,
      userId,
      timestamp: Date.now(),
      properties,
    }

    this.events.push(event)

    // Maintain max 100k events
    if (this.events.length > 100000) {
      this.events.shift()
    }

    return event
  }

  startSession(userId, metadata = {}) {
    const sessionId = `session_${Date.now()}_${Math.random()}`
    const session = {
      id: sessionId,
      userId,
      startTime: Date.now(),
      endTime: null,
      events: [],
      properties: metadata,
    }

    this.sessions.set(sessionId, session)
    return sessionId
  }

  endSession(sessionId) {
    const session = this.sessions.get(sessionId)
    if (session) {
      session.endTime = Date.now()
      session.duration = session.endTime - session.startTime
    }
    return session
  }

  // Cohort analysis
  createCohort(name, criteria) {
    const cohort = {
      name,
      criteria,
      users: new Set(),
      createdAt: Date.now(),
    }

    // Find matching users
    for (const event of this.events) {
      if (this.matchesCriteria(event, criteria)) {
        cohort.users.add(event.userId)
      }
    }

    this.cohorts.set(name, cohort)
    return cohort
  }

  // Funnel analysis
  createFunnel(name, steps) {
    const funnel = {
      name,
      steps,
      analysis: {},
      createdAt: Date.now(),
    }

    this.analyzeFunnel(funnel)
    this.funnels.set(name, funnel)
    return funnel
  }

  analyzeFunnel(funnel) {
    const stepsUsers = funnel.steps.map(() => new Set())

    for (const event of this.events) {
      for (let i = 0; i < funnel.steps.length; i++) {
        const step = funnel.steps[i]
        if (this.matchesCriteria(event, step)) {
          stepsUsers[i].add(event.userId)
        }
      }
    }

    funnel.analysis = {
      steps: funnel.steps.map((step, i) => ({
        step: step.name,
        users: stepsUsers[i].size,
        dropoff:
          i > 0 ? ((stepsUsers[i - 1].size - stepsUsers[i].size) / stepsUsers[i - 1].size) * 100 : 0,
      })),
    }
  }

  // Retention analysis
  getRetention(cohortName, window = 7) {
    const cohort = this.cohorts.get(cohortName)
    if (!cohort) return null

    const retention = {}

    for (const userId of cohort.users) {
      const userEvents = this.events.filter(e => e.userId === userId)
      if (userEvents.length === 0) continue

      const firstEvent = userEvents[0]
      let day = 0

      for (const event of userEvents) {
        const daysSinceFirst = Math.floor((event.timestamp - firstEvent.timestamp) / (86400000 * window))
        if (daysSinceFirst !== day) {
          day = daysSinceFirst
          retention[day] = (retention[day] || 0) + 1
        }
      }
    }

    return retention
  }

  // Revenue metrics
  getRevenue(startDate, endDate) {
    const revenue = {
      total: 0,
      byEvent: {},
      transactions: 0,
    }

    for (const event of this.events) {
      if (event.timestamp < startDate || event.timestamp > endDate) continue

      if (event.properties.value) {
        revenue.total += event.properties.value
        revenue.byEvent[event.name] = (revenue.byEvent[event.name] || 0) + event.properties.value
        revenue.transactions++
      }
    }

    return revenue
  }

  // User segmentation
  getUserSegments() {
    const segments = {
      active: new Set(),
      inactive: new Set(),
      churn: new Set(),
      highValue: new Set(),
    }

    const userEvents = new Map()

    for (const event of this.events) {
      if (!userEvents.has(event.userId)) {
        userEvents.set(event.userId, [])
      }
      userEvents.get(event.userId).push(event)
    }

    const now = Date.now()
    const thirtyDaysAgo = now - 30 * 86400000
    const ninetyDaysAgo = now - 90 * 86400000

    for (const [userId, events] of userEvents) {
      const lastEvent = events[events.length - 1]
      const recentEvents = events.filter(e => e.timestamp > thirtyDaysAgo)
      const totalValue = events.reduce((sum, e) => sum + (e.properties.value || 0), 0)

      if (recentEvents.length > 0) {
        segments.active.add(userId)
      } else if (lastEvent.timestamp > ninetyDaysAgo) {
        segments.inactive.add(userId)
      } else {
        segments.churn.add(userId)
      }

      if (totalValue > 1000) {
        segments.highValue.add(userId)
      }
    }

    return segments
  }

  matchesCriteria(event, criteria) {
    if (criteria.eventName && event.name !== criteria.eventName) return false
    if (criteria.property) {
      const [key, value] = criteria.property
      if (event.properties[key] !== value) return false
    }
    return true
  }

  getStats() {
    return {
      totalEvents: this.events.length,
      activeSessions: Array.from(this.sessions.values()).filter(s => !s.endTime).length,
      cohorts: this.cohorts.size,
      funnels: this.funnels.size,
      uniqueUsers: new Set(this.events.map(e => e.userId)).size,
    }
  }

  exportData(format = 'json') {
    if (format === 'json') {
      return JSON.stringify({
        events: this.events,
        cohorts: Array.from(this.cohorts.values()),
        funnels: Array.from(this.funnels.values()),
      })
    }
    return null
  }
}

module.exports = AnalyticsEngine
