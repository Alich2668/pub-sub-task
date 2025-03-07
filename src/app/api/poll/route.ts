import { type NextRequest, NextResponse } from "next/server"
import { getRecentMessages } from "@/lib/redis"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const since = searchParams.get("since")
    const sinceTimestamp = since ? Number.parseInt(since, 10) : undefined

    // Get messages since the specified timestamp
    const messages = getRecentMessages(sinceTimestamp)

    return NextResponse.json({
      messages,
      timestamp: Date.now(),
    })
  } catch (error) {
    console.error("Error polling messages:", error)
    return NextResponse.json({ error: "Failed to poll messages" }, { status: 500 })
  }
}

