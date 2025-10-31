import { supabase } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { data: collections, error } = await supabase
      .from('collections')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(
      {
        success: true,
        data: collections,
        count: collections?.length || 0,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error fetching collections:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch collections",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data: collection, error } = await supabase
      .from('collections')
      .insert([body])
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(
      {
        success: true,
        data: collection,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Error creating collection:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create collection",
      },
      { status: 500 },
    )
  }
}
