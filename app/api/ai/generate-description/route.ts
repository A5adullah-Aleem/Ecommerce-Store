import { generateProductDescription } from "@/lib/groq"
import { type NextRequest, NextResponse } from "next/server"

export async function POST(request: NextRequest) {
  try {
    const { name, category, type, collection } = await request.json()

    if (!name || !category || !type || !collection) {
      return NextResponse.json(
        {
          success: false,
          error: "Product name, category, type, and collection are required to generate a description.",
        },
        { status: 400 },
      )
    }

    const description = await generateProductDescription(name, type, category, collection)

    if (!description) {
      return NextResponse.json(
        {
          success: false,
          error: "Failed to generate description. Please check your OpenAI API key.",
        },
        { status: 500 },
      )
    }

    return NextResponse.json(
      {
        success: true,
        description,
      },
      { status: 200 },
    )
  } catch (error) {
    console.error("[AI] Error generating description:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to generate description",
      },
      { status: 500 },
    )
  }
}
