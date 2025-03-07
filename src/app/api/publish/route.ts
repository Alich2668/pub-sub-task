import { type NextRequest, NextResponse } from "next/server"
import { publisher, addMessage } from "@/lib/redis"
import { v4 as uuidv4 } from "uuid"

export async function POST(request: NextRequest) {
  try {
    const { message, channel = "messages" } = await request.json()

    if (!message) {
      return NextResponse.json({ error: "Message is required" }, { status: 400 })
    }

    const id = uuidv4()

    // Create message object
    const messageObj = JSON.stringify({
      id,
      message,
      timestamp: Date.now(),
    })

    try {
      await publisher.publish(channel, messageObj)
    } catch (error) {
      console.error("Redis publish error:", error)
    }

    addMessage(id, message)

    return NextResponse.json({ success: true, id })
  } catch (error) {
    console.error("Error publishing message:", error)
    return NextResponse.json({ error: "Failed to publish message" }, { status: 500 })
  }
}

