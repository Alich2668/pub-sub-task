import type { NextRequest } from "next/server"
import { subscriber } from "@/lib/redis"

export async function GET(req: NextRequest) {
  try {
    
    subscriber.subscribe("messages")
  } catch (error) {
    console.error("Error subscribing to Redis channel:", error)
  }

  return new Response("Polling-based implementation active")
}

