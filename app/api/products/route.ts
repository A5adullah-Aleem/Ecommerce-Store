import { supabase } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const collection = searchParams.get("collection")
    const type = searchParams.get("type")

    let query = supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false })

    if (collection) {
      query = query.eq('collection', collection)
    }
    if (type) {
      query = query.eq('type', type)
    }

    const { data: products, error } = await query

    if (error) {
      throw error
    }

    return NextResponse.json(
      {
        success: true,
        data: products,
        count: products?.length || 0,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error fetching products:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch products",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data: product, error } = await supabase
      .from('products')
      .insert([body])
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(
      {
        success: true,
        data: product,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Error creating product:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create product",
      },
      { status: 500 },
    )
  }
}
