import Image from "next/image"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface ModelAvatarProps {
  modelName: string
  size?: "sm" | "md" | "lg"
}

export function ModelAvatar({ modelName, size = "md" }: ModelAvatarProps) {
  const getModelLogo = (name: string) => {
    switch (name) {
      case "Grok (xAI)":
        return "/images/grok-logo-new.png"
      case "ChatGPT (OpenAI)":
        return "/images/chatgpt-logo.png"
      case "DeepSeek":
        return "/images/deepseek-logo.png"
      case "Claude (Anthropic)":
        return "/images/claude-logo.png"
      default:
        return null
    }
  }

  const getModelInitial = (name: string) => {
    return name.charAt(0)
  }

  const getModelColor = (name: string) => {
    switch (name) {
      case "Grok (xAI)":
        return "bg-black"
      case "ChatGPT (OpenAI)":
        return "bg-orange-400"
      case "DeepSeek":
        return "bg-white"
      case "Claude (Anthropic)":
        return "bg-blue-500"
      default:
        return "bg-gray-500"
    }
  }

  const sizeClasses = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  }

  const logoPath = getModelLogo(modelName)

  return (
    <Avatar className={`${sizeClasses[size]} overflow-hidden ${!logoPath ? getModelColor(modelName) : ""}`}>
      {logoPath ? (
        <div className="relative w-full h-full">
          <Image src={logoPath || "/placeholder.svg"} alt={`${modelName} logo`} fill className="object-contain p-1" />
        </div>
      ) : (
        <AvatarFallback className="text-white font-bold">{getModelInitial(modelName)}</AvatarFallback>
      )}
    </Avatar>
  )
}

