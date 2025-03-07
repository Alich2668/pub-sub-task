"use client"

import { useState, useEffect, useCallback } from "react"
import MessageForm from "./MessageForm"
import MessageList from "./MessageList"

interface Message {
  id: string
  message: string
  timestamp: number
}

export default function PubSubClient() {
  const [messages, setMessages] = useState<Message[]>([])
  const [isConnected, setIsConnected] = useState(false)
  const [lastPollTimestamp, setLastPollTimestamp] = useState<number | null>(null)

  // Initialize connection state
  useEffect(() => {
    setIsConnected(true)

    // Initialize the socket endpoint
    fetch("/api/socket").catch((err) => {
      console.error("Error initializing socket endpoint:", err)
    })

    return () => {}
  }, [])

  // Polling implementation
  useEffect(() => {
    const pollInterval = setInterval(async () => {
      try {
        const response = await fetch(`/api/poll?since=${lastPollTimestamp || 0}`)
        const data = await response.json()

        if (data.messages && data.messages.length > 0) {
          setMessages((prev) => {
            const newMessages = data.messages.filter(
              (newMsg: Message) => !prev.some((existingMsg) => existingMsg.id === newMsg.id),
            )
            return [...newMessages, ...prev]
          })
        }

        setLastPollTimestamp(data.timestamp)
      } catch (error) {
        console.error("Polling failed:", error)
      }
    }, 3000)

    return () => clearInterval(pollInterval)
  }, [lastPollTimestamp])

  // Send message function
  const sendMessage = useCallback(
    async (message: string) => {
      try {
        const response = await fetch("/api/publish", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ message }),
        })

        if (!response.ok) {
          throw new Error("Failed to send message")
        }

        // Trigger an immediate poll
        const pollResponse = await fetch(`/api/poll?since=${lastPollTimestamp || 0}`)
        const data = await pollResponse.json()

        if (data.messages && data.messages.length > 0) {
          setMessages((prev) => {
            const newMessages = data.messages.filter(
              (newMsg: Message) => !prev.some((existingMsg) => existingMsg.id === newMsg.id),
            )
            return [...newMessages, ...prev]
          })
        }

        setLastPollTimestamp(data.timestamp)
      } catch (error) {
        console.error("Error sending message:", error)
        throw error
      }
    },
    [lastPollTimestamp],
  )

  return (
    <div className="space-y-6 w-full max-w-2xl mx-auto">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">Redis Pub/Sub Chat</h2>
            <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 border border-gray-300">
              Polling
            </span>
          </div>
          <p className="text-sm text-gray-600 mt-1">A real-time chat system using Redis Pub/Sub</p>
        </div>
        <div className="px-6 py-4 space-y-6">
          <MessageList messages={messages} />
          <MessageForm onSendMessage={sendMessage} isConnected={isConnected} />
        </div>
      </div>
    </div>
  )
}

