import { supabase } from "@/lib/supabase"
import { generateSlug } from "@/lib/slug"
import { type NextRequest, NextResponse } from "next/server"

/**
 * Check if the param is a UUID or a slug
 */
function isUUID(str: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i
  return uuidRegex.test(str)
}

/**
 * Generate a unique slug for a product (excluding current product)
 */
async function generateUniqueProductSlug(name: string, excludeId: string): Promise<string> {
  const baseSlug = generateSlug(name)
  
  // Check if slug already exists (excluding current product)
  const { data: existing } = await supabase
    .from('products')
    .select('slug')
    .eq('slug', baseSlug)
    .neq('id', excludeId)
    .maybeSingle()
  
  if (!existing) {
    return baseSlug
  }
  
  // If slug exists, append a counter
  let counter = 1
  let newSlug = `${baseSlug}-${counter}`
  
  while (true) {
    const { data: existingWithCounter } = await supabase
      .from('products')
      .select('slug')
      .eq('slug', newSlug)
      .neq('id', excludeId)
      .maybeSingle()
    
    if (!existingWithCounter) {
      return newSlug
    }
    
    counter++
    newSlug = `${baseSlug}-${counter}`
  }
}

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    
    // Check if id is UUID or slug
    let query = supabase.from('products').select('*')
    
    if (isUUID(id)) {
      query = query.eq('id', id)
    } else {
      // Treat as slug
      query = query.eq('slug', id)
    }
    
    const { data: product, error } = await query.single()

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
    
    // If name is being updated, regenerate the slug
    let updateData = { ...body }
    if (body.name) {
      const newSlug = await generateUniqueProductSlug(body.name, id)
      updateData.slug = newSlug
    }

    const { data: product, error } = await supabase
      .from('products')
      .update(updateData)
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
