"use client"

import { useState } from "react"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import { motion } from "framer-motion"

export default function ApiTestPage() {
  const [testResults, setTestResults] = useState<any[]>([])
  const [loading, setLoading] = useState(false)

  const runTests = async () => {
    setLoading(true)
    setTestResults([])

    const tests = [
      {
        name: "Backend Health Check",
        fn: () => apiClient.healthCheck(),
      },
      {
        name: "Test Endpoint",
        fn: () => apiClient.testConnection(),
      },
      {
        name: "Get Products",
        fn: () => apiClient.getProducts(),
      },
      {
        name: "Get Collections",
        fn: () => apiClient.getCollections(),
      },
    ]

    for (const test of tests) {
      try {
        const result = await test.fn()
        setTestResults((prev) => [
          ...prev,
          {
            name: test.name,
            status: result.success ? "success" : "error",
            data: result,
            timestamp: new Date().toLocaleTimeString(),
          },
        ])
      } catch (error: any) {
        setTestResults((prev) => [
          ...prev,
          {
            name: test.name,
            status: "error",
            error: error.message,
            timestamp: new Date().toLocaleTimeString(),
          },
        ])
      }
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <section className="py-16 md:py-24">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <h1 className="text-4xl font-serif font-bold mb-4">API Connection Test</h1>
            <p className="text-muted-foreground mb-8">Test the connection between frontend and backend</p>

            <Button
              onClick={runTests}
              disabled={loading}
              className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg mb-8"
            >
              {loading ? "Running Tests..." : "Run Tests"}
            </Button>

            <div className="space-y-4">
              {testResults.map((result, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border-2 ${
                    result.status === "success" ? "border-green-500 bg-green-50" : "border-red-500 bg-red-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-bold text-lg">{result.name}</h3>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        result.status === "success" ? "bg-green-200 text-green-800" : "bg-red-200 text-red-800"
                      }`}
                    >
                      {result.status === "success" ? "✓ Success" : "✗ Error"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">{result.timestamp}</p>
                  <pre className="bg-white p-3 rounded text-xs overflow-auto max-h-48">
                    {JSON.stringify(result.data || result.error, null, 2)}
                  </pre>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
