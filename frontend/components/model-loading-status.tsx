import { Loader2 } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { ModelAvatar } from "@/components/model-avatar"

interface ModelLoadingStatusProps {
  currentModel: string | null
  loadedModels: { [key: string]: boolean }
}

export function ModelLoadingStatus({ currentModel, loadedModels }: ModelLoadingStatusProps) {
  const models = ["Grok (xAI)", "ChatGPT (OpenAI)", "DeepSeek", "Claude (Anthropic)"]

  if (!currentModel && Object.keys(loadedModels).length === 0) {
    return null
  }

  return (
    <Card className="mb-8">
      <CardContent className="p-4">
        <h3 className="text-lg font-medium mb-4">AI Models Thinking...</h3>
        <div className="space-y-4">
          {models.map((model) => (
            <div key={model} className="flex items-center">
              <ModelAvatar modelName={model} size="sm" />
              <div className="ml-3 flex-1">
                <div className="flex items-center justify-between">
                  <span className="font-medium">{model}</span>
                  <div className="flex items-center">
                    {currentModel === model ? (
                      <div className="flex items-center text-amber-500">
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        <span>Thinking...</span>
                      </div>
                    ) : loadedModels[model] ? (
                      <span className="text-green-500">Complete</span>
                    ) : (
                      <span className="text-gray-400">Waiting...</span>
                    )}
                  </div>
                </div>
                {currentModel === model && (
                  <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2 dark:bg-gray-700">
                    <div className="bg-amber-500 h-2.5 rounded-full animate-pulse" style={{ width: "100%" }}></div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

