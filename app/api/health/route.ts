import { supabase } from "@/lib/supabase"
import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Test Supabase connection by querying a simple table
    const { error } = await supabase
      .from('products')
      .select('id')
      .limit(1)

    if (error) {
      throw error
    }

    return NextResponse.json(
      {
        status: "ok",
        message: "Backend is running and Supabase is connected",
        timestamp: new Date().toISOString(),
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Health check error:", error)
    return NextResponse.json(
      {
        status: "error",
        message: "Failed to connect to Supabase",
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
