import { supabase } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { data: order, error } = await supabase
      .from('orders')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !order) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: order,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error fetching order:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to fetch order",
      },
      { status: 500 },
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const body = await request.json()

    const { data: order, error } = await supabase
      .from('orders')
      .update(body)
      .eq('id', id)
      .select()
      .single()

    if (error || !order) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        data: order,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error updating order:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to update order",
      },
      { status: 500 },
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { data: order, error } = await supabase
      .from('orders')
      .delete()
      .eq('id', id)
      .select()
      .single()

    if (error || !order) {
      return NextResponse.json(
        {
          success: false,
          error: "Order not found",
        },
        { status: 404 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        message: "Order deleted successfully",
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Error deleting order:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to delete order",
      },
      { status: 500 },
    )
  }
}
