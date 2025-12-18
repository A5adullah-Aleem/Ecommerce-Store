import { supabase } from "@/lib/supabase"
import { generateSlug } from "@/lib/slug"
import { generateProductSEO } from "@/lib/groq"
import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const collection = searchParams.get("collection")
    const type = searchParams.get("type")
    const slug = searchParams.get("slug")

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
    if (slug) {
      query = query.eq('slug', slug)
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

/**
 * Generate a unique slug for a product
 */
async function generateUniqueProductSlug(name: string, excludeId?: string, customSlug?: string): Promise<string> {
  const baseSlug = customSlug || generateSlug(name)
  
  // Check if slug already exists
  let query = supabase
    .from('products')
    .select('slug')
    .eq('slug', baseSlug)
  
  if (excludeId) {
    query = query.neq('id', excludeId)
  }
  
  const { data: existing } = await query.maybeSingle()
  
  if (!existing) {
    return baseSlug
  }
  
  // If slug exists, append a counter
  let counter = 1
  let newSlug = `${baseSlug}-${counter}`
  
  while (true) {
    let checkQuery = supabase
      .from('products')
      .select('slug')
      .eq('slug', newSlug)
    
    if (excludeId) {
      checkQuery = checkQuery.neq('id', excludeId)
    }
    
    const { data: existingWithCounter } = await checkQuery.maybeSingle()
    
    if (!existingWithCounter) {
      return newSlug
    }
    
    counter++
    newSlug = `${baseSlug}-${counter}`
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    
    // Generate SEO content using Groq AI (Llama 3.3)
    console.log("🤖 Generating SEO content with Groq AI...")
    const seoData = await generateProductSEO({
      name: body.name,
      description: body.description,
      price: body.price,
      category: body.category,
      type: body.type,
      collection: body.collection,
    })
    
    // Generate unique slug (prefer AI-generated, fallback to name-based)
    const baseSlug = seoData?.seoSlug || generateSlug(body.name)
    const slug = await generateUniqueProductSlug(body.name, undefined, baseSlug)
    
    const productData = {
      ...body,
      slug,
      // Store AI-generated SEO data
      meta_title: seoData?.metaTitle || null,
      meta_description: seoData?.metaDescription || null,
      meta_keywords: seoData?.metaKeywords || [],
    }

    console.log("📝 Saving product with SEO:", {
      slug: productData.slug,
      meta_title: productData.meta_title,
      meta_description: productData.meta_description?.slice(0, 50) + "...",
    })

    const { data: product, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single()

    if (error) {
      throw error
    }

    return NextResponse.json(
      {
        success: true,
        data: product,
        seoGenerated: !!seoData,
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
