import { DebateForm } from "@/components/debate-form"
import { DebateHeader } from "@/components/debate-header"

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto px-4 py-8">
        <DebateHeader />
        <DebateForm />
      </div>
    </main>
  )
}

