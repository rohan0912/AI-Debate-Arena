import { NextResponse } from "next/server"

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const topic = searchParams.get("topic")

  if (!topic) {
    return NextResponse.json({ error: "Topic is required" }, { status: 400 })
  }

  // Set up Server-Sent Events
  const encoder = new TextEncoder()
  const stream = new ReadableStream({
    async start(controller) {
      try {
        // Send initial connection message
        controller.enqueue(encoder.encode(`data: ${JSON.stringify({ type: "connected" })}\n\n`))

        // Simulate backend API call
        const backendUrl = process.env.BACKEND_API_URL || "http://localhost:3000"

        // First, notify about starting the debate
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "model_status",
              model: "Grok (xAI)",
              message: "Getting response from Grok (xAI)...",
            })}\n\n`,
          ),
        )

        // Make the actual API call
        const response = await fetch(`${backendUrl}/api/debate`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ topic }),
        })

        if (!response.ok) {
          const errorData = await response.json()
          controller.enqueue(
            encoder.encode(
              `data: ${JSON.stringify({
                type: "error",
                message: errorData.error || "Failed to start debate",
              })}\n\n`,
            ),
          )
          return
        }

        const data = await response.json()

        // Simulate the progression of models thinking
        // In a real implementation, you would get this from your backend
        const models = ["Grok (xAI)", "ChatGPT (OpenAI)", "DeepSeek", "Claude (Anthropic)"]

        // Simulate each model thinking in sequence
        for (let i = 0; i < models.length; i++) {
          if (i > 0) {
            // Mark previous model as complete and start the next one
            await new Promise((resolve) => setTimeout(resolve, 1000))
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({
                  type: "model_status",
                  model: models[i],
                  message: `Getting response from ${models[i]}...`,
                })}\n\n`,
              ),
            )
          }
        }

        // Send the complete results
        await new Promise((resolve) => setTimeout(resolve, 1000))
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "complete",
              results: data,
            })}\n\n`,
          ),
        )
      } catch (error) {
        controller.enqueue(
          encoder.encode(
            `data: ${JSON.stringify({
              type: "error",
              message: error instanceof Error ? error.message : "An unknown error occurred",
            })}\n\n`,
          ),
        )
      } finally {
        controller.close()
      }
    },
  })

  return new Response(stream, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
    },
  })
}

