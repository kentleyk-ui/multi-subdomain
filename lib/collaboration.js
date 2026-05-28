// Multi-user collaboration system - Phase 8

class CollaborationManager {
  constructor() {
    this.collaborations = new Map()
    this.activeUsers = new Map()
    this.locks = new Map()
  }

  startCollaboration(resourceId, userId, resourceType = 'document') {
    if (!this.collaborations.has(resourceId)) {
      this.collaborations.set(resourceId, {
        id: resourceId,
        type: resourceType,
        owner: userId,
        participants: new Set(),
        changes: [],
        version: 0,
        createdAt: Date.now(),
      })
    }

    const collab = this.collaborations.get(resourceId)
    collab.participants.add(userId)
    this.trackActiveUser(userId, resourceId)

    return collab
  }

  trackActiveUser(userId, resourceId) {
    if (!this.activeUsers.has(userId)) {
      this.activeUsers.set(userId, new Set())
    }
    this.activeUsers.get(userId).add(resourceId)
  }

  applyChange(resourceId, userId, change) {
    const collab = this.collaborations.get(resourceId)
    if (!collab) {
      throw new Error(`Collaboration ${resourceId} not found`)
    }

    const versionedChange = {
      userId,
      timestamp: Date.now(),
      version: collab.version,
      ...change,
    }

    collab.changes.push(versionedChange)
    collab.version++

    return versionedChange
  }

  mergeChanges(resourceId, changes) {
    const collab = this.collaborations.get(resourceId)
    if (!collab) {
      throw new Error(`Collaboration ${resourceId} not found`)
    }

    // Simple merge strategy - apply in chronological order
    const mergedChanges = changes.sort((a, b) => a.timestamp - b.timestamp)

    for (const change of mergedChanges) {
      collab.changes.push(change)
    }

    collab.version = Math.max(collab.version, Math.max(...changes.map(c => c.version)))
    return mergedChanges
  }

  acquireLock(resourceId, userId, duration = 5000) {
    if (this.locks.has(resourceId)) {
      const lock = this.locks.get(resourceId)
      if (lock.userId !== userId && Date.now() < lock.expiresAt) {
        throw new Error(`Resource locked by ${lock.userId}`)
      }
    }

    const lock = {
      userId,
      acquiredAt: Date.now(),
      expiresAt: Date.now() + duration,
    }

    this.locks.set(resourceId, lock)
    return lock
  }

  releaseLock(resourceId, userId) {
    const lock = this.locks.get(resourceId)
    if (lock && lock.userId === userId) {
      this.locks.delete(resourceId)
      return true
    }
    return false
  }

  getCollaborators(resourceId) {
    const collab = this.collaborations.get(resourceId)
    return collab ? Array.from(collab.participants) : []
  }

  getChangeHistory(resourceId, startVersion = 0) {
    const collab = this.collaborations.get(resourceId)
    if (!collab) {
      return []
    }
    return collab.changes.filter(c => c.version >= startVersion)
  }

  endCollaboration(resourceId, userId) {
    const collab = this.collaborations.get(resourceId)
    if (collab) {
      collab.participants.delete(userId)
      if (collab.participants.size === 0) {
        this.collaborations.delete(resourceId)
      }
    }

    const resources = this.activeUsers.get(userId)
    if (resources) {
      resources.delete(resourceId)
    }
  }

  // Conflict resolution using operational transformation
  resolveConflict(localChange, remoteChange) {
    if (localChange.timestamp < remoteChange.timestamp) {
      return { primary: remoteChange, secondary: localChange }
    }
    return { primary: localChange, secondary: remoteChange }
  }

  getStats() {
    return {
      activeCollaborations: this.collaborations.size,
      activeUsers: this.activeUsers.size,
      activeLocks: this.locks.size,
      totalChanges: Array.from(this.collaborations.values()).reduce(
        (sum, c) => sum + c.changes.length,
        0
      ),
    }
  }
}

module.exports = CollaborationManager
