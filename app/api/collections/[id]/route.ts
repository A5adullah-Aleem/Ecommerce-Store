import { supabase } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { data: collection, error } = await supabase
      .from('collections')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !collection) {
      return NextResponse.json(
        {
          success: false,
          error: "Collection not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: collection,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error fetching collection:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch collection",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const { data: collection, error } = await supabase
      .from('collections')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error || !collection) {
      return NextResponse.json(
        {
          success: false,
          error: "Collection not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: collection,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error updating collection:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update collection",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { data: collection, error } = await supabase
      .from('collections')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error || !collection) {
      return NextResponse.json(
        {
          success: false,
          error: "Collection not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Collection deleted successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error deleting collection:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete collection",
      },
      { status: 500 },
    )
  }
}
