import { supabase } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { data: product, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !product) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: product,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error fetching product:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch product",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const { data: product, error } = await supabase
      .from('products')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error || !product) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: product,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error updating product:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update product",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { data: product, error } = await supabase
      .from('products')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error || !product) {
      return NextResponse.json(
        {
          success: false,
          error: "Product not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Product deleted successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error deleting product:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete product",
      },
      { status: 500 },
    )
  }
}
