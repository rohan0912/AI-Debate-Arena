"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { DebateResults } from "@/components/debate-results"
import { Loader2 } from "lucide-react"
import { ModelLoadingStatus } from "@/components/model-loading-status"

interface DebateResponse {
  topic: string
  responses: {
    model: string
    response: string
  }[]
}

export function DebateForm() {
  const [topic, setTopic] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [debateResults, setDebateResults] = useState<DebateResponse | null>(null)
  const [loadingModels, setLoadingModels] = useState<{ [key: string]: boolean }>({})
  const [currentModelLoading, setCurrentModelLoading] = useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!topic.trim()) {
      setError("Please enter a debate topic")
      return
    }

    setIsLoading(true)
    setError(null)
    setDebateResults(null)
    setLoadingModels({})

    try {
      // Use EventSource to get streaming updates from the backend
      const eventSource = new EventSource(`/api/debate/stream?topic=${encodeURIComponent(topic)}`)

      eventSource.onmessage = (event) => {
        const data = JSON.parse(event.data)

        if (data.type === "model_status") {
          setCurrentModelLoading(data.model)
          setLoadingModels((prev) => ({
            ...prev,
            [data.model]: true,
          }))
        } else if (data.type === "complete") {
          setDebateResults(data.results)
          eventSource.close()
          setIsLoading(false)
          setCurrentModelLoading(null)
        } else if (data.type === "error") {
          setError(data.message || "An error occurred")
          eventSource.close()
          setIsLoading(false)
          setCurrentModelLoading(null)
        }
      }

      eventSource.onerror = () => {
        setError("Connection error. Please try again.")
        eventSource.close()
        setIsLoading(false)
        setCurrentModelLoading(null)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      setIsLoading(false)
      setCurrentModelLoading(null)
    }
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Card className="p-6 mb-8">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="topic" className="block text-sm font-medium mb-1 text-gray-700 dark:text-gray-300">
              Enter a Debate Topic
            </label>
            <Input
              id="topic"
              value={topic}
              onChange={(e) => setTopic(e.target.value)}
              placeholder="e.g., Is artificial intelligence beneficial for humanity?"
              className="w-full"
              disabled={isLoading}
            />
          </div>

          {error && <div className="text-red-500 text-sm">{error}</div>}

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Starting Debate...
              </>
            ) : (
              "Start Debate"
            )}
          </Button>
        </form>
      </Card>

      {isLoading && <ModelLoadingStatus currentModel={currentModelLoading} loadedModels={loadingModels} />}

      {debateResults && <DebateResults results={debateResults} />}
    </div>
  )
}

