"use client"

import { useEffect, useState } from "react"
import { motion } from "framer-motion"

export function DebateHeader() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <motion.header
      className="mb-8 text-center"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <h1 className="text-4xl font-bold tracking-tight text-gray-900 dark:text-white sm:text-5xl mb-2">
        AI Debate Arena
      </h1>
      <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
        Watch as leading AI models debate topics of your choice. Compare their reasoning, arguments, and perspectives in
        real-time.
      </p>
    </motion.header>
  )
}

