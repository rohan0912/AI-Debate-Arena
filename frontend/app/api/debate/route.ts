import { NextResponse } from "next/server"

export async function POST(request: Request) {
  try {
    const { topic } = await request.json()

    if (!topic) {
      return NextResponse.json({ error: "Topic is required" }, { status: 400 })
    }

    // Forward the request to your backend API
    const backendUrl = process.env.BACKEND_API_URL || "http://localhost:3000"

    const response = await fetch(`${backendUrl}/api/debate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ topic }),
    })

    if (!response.ok) {
      const errorData = await response.json()
      return NextResponse.json({ error: errorData.error || "Failed to start debate" }, { status: response.status })
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error("Error in debate route:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

