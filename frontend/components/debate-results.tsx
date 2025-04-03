"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { motion } from "framer-motion"
import { ModelAvatar } from "@/components/model-avatar"

interface DebateResponse {
  topic: string
  responses: {
    model: string
    response: string
  }[]
}

interface DebateResultsProps {
  results: DebateResponse
}

export function DebateResults({ results }: DebateResultsProps) {
  const [activeTab, setActiveTab] = useState("all")

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-xl">
            Debate Topic: <span className="font-normal">{results.topic}</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              {results.responses.map((response, index) => (
                <TabsTrigger key={index} value={response.model} className="flex items-center gap-2">
                  <ModelAvatar modelName={response.model} size="sm" />
                  <span className="hidden sm:inline">{response.model.split(" ")[0]}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="all" className="space-y-6">
              {results.responses.map((response, index) => (
                <ResponseCard key={index} response={response} index={index} />
              ))}
            </TabsContent>

            {results.responses.map((response, index) => (
              <TabsContent key={index} value={response.model}>
                <ResponseCard response={response} index={index} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

interface ResponseCardProps {
  response: {
    model: string
    response: string
  }
  index: number
}

function ResponseCard({ response, index }: ResponseCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
    >
      <Card className="overflow-hidden">
        <div className="flex items-start p-4 border-b">
          <div className="mr-3">
            <ModelAvatar modelName={response.model} size="md" />
          </div>
          <div>
            <h3 className="font-medium">{response.model}</h3>
            <Badge variant="outline" className="mt-1">
              Response #{index + 1}
            </Badge>
          </div>
        </div>
        <CardContent className="p-4 whitespace-pre-line">{response.response}</CardContent>
      </Card>
    </motion.div>
  )
}

