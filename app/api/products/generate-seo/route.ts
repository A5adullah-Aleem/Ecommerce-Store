import { supabase } from "@/lib/supabase"
import { generateProductSEO } from "@/lib/groq"
import { type NextRequest, NextResponse } from "next/server"

/**
 * POST /api/products/generate-seo
 * Regenerate SEO for a specific product or all products
 * Body: { productId?: string } - If no productId, regenerates for all products without SEO
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => ({}))
    const { productId } = body

    if (productId) {
      // Regenerate SEO for a specific product
      const { data: product, error } = await supabase
        .from("products")
        .select("*")
        .eq("id", productId)
        .single()

      if (error || !product) {
        return NextResponse.json(
          { success: false, error: "Product not found" },
          { status: 404 }
        )
      }

      console.log(`🤖 Generating SEO for: ${product.name}`)
      
      const seoData = await generateProductSEO({
        name: product.name,
        description: product.description,
        price: product.price,
        category: product.category,
        type: product.type,
        collection: product.collection,
      })

      if (!seoData) {
        return NextResponse.json(
          { success: false, error: "Failed to generate SEO" },
          { status: 500 }
        )
      }

      const { error: updateError } = await supabase
        .from("products")
        .update({
          meta_title: seoData.metaTitle,
          meta_description: seoData.metaDescription,
          meta_keywords: seoData.metaKeywords,
        })
        .eq("id", productId)

      if (updateError) {
        throw updateError
      }

      return NextResponse.json({
        success: true,
        data: {
          productId,
          seo: seoData,
        },
        message: "SEO generated successfully",
      })
    } else {
      // Regenerate SEO for all products without SEO data
      const { data: products, error } = await supabase
        .from("products")
        .select("*")
        .or("meta_title.is.null,meta_description.is.null")
        .order("created_at", { ascending: false })

      if (error) throw error

      if (!products || products.length === 0) {
        return NextResponse.json({
          success: true,
          message: "All products already have SEO data",
          updated: 0,
        })
      }

      console.log(`🤖 Generating SEO for ${products.length} products...`)

      let updated = 0
      const results = []

      for (const product of products) {
        try {
          const seoData = await generateProductSEO({
            name: product.name,
            description: product.description,
            price: product.price,
            category: product.category,
            type: product.type,
            collection: product.collection,
          })

          if (seoData) {
            await supabase
              .from("products")
              .update({
                meta_title: seoData.metaTitle,
                meta_description: seoData.metaDescription,
                meta_keywords: seoData.metaKeywords,
              })
              .eq("id", product.id)

            updated++
            results.push({
              id: product.id,
              name: product.name,
              status: "success",
            })
          }

          // Add delay to avoid rate limiting
          await new Promise((resolve) => setTimeout(resolve, 500))
        } catch (err) {
          results.push({
            id: product.id,
            name: product.name,
            status: "error",
            error: err instanceof Error ? err.message : "Unknown error",
          })
        }
      }

      return NextResponse.json({
        success: true,
        message: `SEO generated for ${updated} products`,
        updated,
        total: products.length,
        results,
      })
    }
  } catch (error) {
    console.error("Error generating SEO:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate SEO",
      },
      { status: 500 }
    )
  }
}

