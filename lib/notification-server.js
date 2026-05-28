// WebSocket server for real-time notifications - Phase 8

const WebSocket = require('ws')
const http = require('http')

class NotificationServer {
  constructor(port = 3001) {
    this.port = port
    this.clients = new Map()
    this.subscriptions = new Map()
    this.messageHistory = []
  }

  start() {
    this.server = http.createServer()
    this.wss = new WebSocket.Server({ server: this.server })

    this.wss.on('connection', (ws) => {
      this.handleConnection(ws)
    })

    this.server.listen(this.port, () => {
      console.log(`Notification server running on port ${this.port}`)
    })

    return this
  }

  handleConnection(ws) {
    const clientId = this.generateClientId()
    this.clients.set(clientId, {
      ws,
      subscriptions: new Set(),
      connectedAt: Date.now(),
    })

    ws.on('message', (data) => {
      try {
        const message = JSON.parse(data)
        this.handleMessage(clientId, message)
      } catch (error) {
        ws.send(JSON.stringify({ error: 'Invalid message format' }))
      }
    })

    ws.on('close', () => {
      this.clients.delete(clientId)
    })

    ws.on('error', (error) => {
      console.error('WebSocket error:', error)
    })
  }

  handleMessage(clientId, message) {
    const { type, channel, data } = message

    switch (type) {
      case 'subscribe':
        this.subscribe(clientId, channel)
        break
      case 'unsubscribe':
        this.unsubscribe(clientId, channel)
        break
      case 'message':
        this.broadcast(channel, data)
        break
      default:
        console.warn(`Unknown message type: ${type}`)
    }
  }

  subscribe(clientId, channel) {
    const client = this.clients.get(clientId)
    if (client) {
      client.subscriptions.add(channel)

      // Send recent history
      const history = this.messageHistory.filter(
        m => m.channel === channel && m.timestamp > Date.now() - 60000
      )
      client.ws.send(
        JSON.stringify({
          type: 'history',
          channel,
          messages: history,
        })
      )
    }
  }

  unsubscribe(clientId, channel) {
    const client = this.clients.get(clientId)
    if (client) {
      client.subscriptions.delete(channel)
    }
  }

  broadcast(channel, data, excludeClientId = null) {
    const message = {
      channel,
      data,
      timestamp: Date.now(),
    }

    // Store in history
    this.messageHistory.push(message)
    if (this.messageHistory.length > 1000) {
      this.messageHistory.shift()
    }

    // Send to subscribers
    for (const [clientId, client] of this.clients.entries()) {
      if (
        client.subscriptions.has(channel) &&
        clientId !== excludeClientId
      ) {
        client.ws.send(
          JSON.stringify({
            type: 'message',
            channel,
            data,
            timestamp: message.timestamp,
          })
        )
      }
    }
  }

  generateClientId() {
    return `client_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  getStats() {
    return {
      connectedClients: this.clients.size,
      subscriptions: this.subscriptions.size,
      messageHistorySize: this.messageHistory.length,
    }
  }

  stop() {
    this.wss.close()
    this.server.close()
  }
}

module.exports = NotificationServer
