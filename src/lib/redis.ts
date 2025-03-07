import { EventEmitter } from "events"

const eventEmitter = new EventEmitter()

let recentMessages: { id: string; message: string; timestamp: number }[] = []
const MAX_MESSAGES = 50

class MockRedis {
  async publish(channel: string, message: string) {
    eventEmitter.emit(channel, message)
    return 1
  }

  subscribe(channel: string) {
    // This is intentionally empty as we handle subscriptions differently
  }

  on(event: string, callback: (channel: string, message: string) => void) {
    if (event === "message") {
      eventEmitter.on("messages", (message) => {
        callback("messages", message)
      })
    }
  }
}

const publisher = new MockRedis()
const subscriber = new MockRedis()

// Add a message to the recent messages cache
export const addMessage = (id: string, message: string) => {
  const newMessage = { id, message, timestamp: Date.now() }
  recentMessages = [newMessage, ...recentMessages.slice(0, MAX_MESSAGES - 1)]
  return newMessage
}

// Get recent messages for polling
export const getRecentMessages = (since?: number) => {
  if (!since) return recentMessages
  return recentMessages.filter((msg) => msg.timestamp > since)
}

export { publisher, subscriber }

