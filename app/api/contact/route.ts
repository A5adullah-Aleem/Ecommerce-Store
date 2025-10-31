import { supabase } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { data: messages, error } = await supabase
      .from('contacts')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(
      {
        success: true,
        data: messages,
        count: messages?.length || 0,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error fetching messages:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch messages",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data: message, error } = await supabase
      .from('contacts')
      .insert([body])
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(
      {
        success: true,
        data: message,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Error creating message:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create message",
      },
      { status: 500 },
    )
  }
}
