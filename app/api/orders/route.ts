import { supabase } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { data: orders, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) {
      throw error
    }

    return NextResponse.json(
      {
        success: true,
        data: orders,
        count: orders?.length || 0,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error fetching orders:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch orders",
      },
      { status: 500 },
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const { data: order, error } = await supabase
      .from('orders')
      .insert([body])
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(
      {
        success: true,
        data: order,
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Error creating order:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to create order",
      },
      { status: 500 },
    )
  }
}
