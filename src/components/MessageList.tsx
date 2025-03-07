"use client"

import { useEffect, useRef } from "react"

interface Message {
  id: string
  message: string
  timestamp: number
}

interface MessageListProps {
  messages: Message[]
}

export default function MessageList({ messages }: MessageListProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [messages])

  return (
    <div className="w-full bg-white rounded-lg shadow-md overflow-hidden">
      <div className="border-b border-gray-200 px-6 py-4">
        <h2 className="text-xl font-semibold text-gray-800">Messages</h2>
      </div>
      <div className="px-6 py-4">
        <div className="space-y-4 max-h-[400px] overflow-y-auto p-2">
          {messages.length === 0 ? (
            <p className="text-center text-gray-500">No messages yet</p>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className="p-3 bg-gray-100 rounded-lg">
                <div className="flex justify-between items-start">
                  <p className="text-sm break-words">{msg.message}</p>
                  <span className="text-xs text-gray-500 ml-2">{new Date(msg.timestamp).toLocaleTimeString()}</span>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>
    </div>
  )
}

