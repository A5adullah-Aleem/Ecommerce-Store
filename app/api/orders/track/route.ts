import { supabase } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const orderId = searchParams.get("orderId")
    const email = searchParams.get("email")

    if (!orderId && !email) {
      return NextResponse.json(
        {
          success: false,
          error: "Order ID or Email is required",
        },
        { status: 400 },
      )
    }

    let query = supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false })

    if (orderId) {
      query = query.eq('id', orderId)
    }

    if (email) {
      query = query.eq('email', email)
    }

    const { data: orders, error } = await query

    if (error) {
      throw error
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 },
      )
    }

    // If searching by email, return the most recent order
    const order = orders[0]

    return NextResponse.json(
      {
        success: true,
        data: order,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error tracking order:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to track order",
      },
      { status: 500 },
    )
  }
}
