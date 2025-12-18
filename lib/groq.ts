/**
 * Groq AI Integration for SEO Generation
 * Using Llama 3.3 70B model for high-quality text generation
 */

const GROQ_API_KEY = process.env.GROQ_API_KEY || ""
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions"

interface ProductSEO {
  metaTitle: string
  metaDescription: string
  metaKeywords: string[]
  seoSlug: string
}

interface ProductInput {
  name: string
  description: string
  price: number
  category: string
  type: string
  collection: string
}

/**
 * Generate SEO content for a product using Groq AI
 */
export async function generateProductSEO(product: ProductInput): Promise<ProductSEO | null> {
  if (!GROQ_API_KEY) {
    console.warn("⚠️ GROQ_API_KEY not set. Using fallback SEO generation.")
    return generateFallbackSEO(product)
  }

  const prompt = `You are an SEO expert for an e-commerce cosmetics and beauty store called "Glamour Cosmetics" in Pakistan. Generate SEO metadata for this product:

Product Name: ${product.name}
Description: ${product.description}
Price: Rs. ${product.price}
Category: ${product.category}
Type: ${product.type}
Collection: ${product.collection}

Generate the following in JSON format ONLY (no markdown, no code blocks, just pure JSON):
{
  "metaTitle": "SEO-optimized title (50-60 characters, include brand and product type)",
  "metaDescription": "Compelling meta description (150-160 characters, include price, key benefits, call-to-action)",
  "metaKeywords": ["array", "of", "relevant", "SEO", "keywords", "10-15 keywords"],
  "seoSlug": "url-friendly-slug-lowercase-with-hyphens"
}

Requirements:
- metaTitle: Include product name, type, and "Glamour Cosmetics" or "Buy Online Pakistan"
- metaDescription: Mention key benefits, price (Rs. ${product.price}), and "Shop now" or "Buy online"
- metaKeywords: Include product name, type, category, beauty-related terms, "Pakistan", "online shopping"
- seoSlug: Lowercase, hyphens for spaces, no special characters, max 50 chars

Return ONLY valid JSON, no explanations.`

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are an SEO expert. Always respond with valid JSON only, no markdown formatting."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      }),
    })

    if (!response.ok) {
      const error = await response.json().catch(() => ({}))
      console.error("Groq API error:", error)
      return generateFallbackSEO(product)
    }

    const data = await response.json()
    
    // Extract text from Groq response (OpenAI-compatible format)
    const text = data.choices?.[0]?.message?.content
    
    if (!text) {
      console.error("No text in Groq response")
      return generateFallbackSEO(product)
    }

    // Clean the response - remove markdown code blocks if present
    let cleanedText = text.trim()
    if (cleanedText.startsWith("```json")) {
      cleanedText = cleanedText.slice(7)
    } else if (cleanedText.startsWith("```")) {
      cleanedText = cleanedText.slice(3)
    }
    if (cleanedText.endsWith("```")) {
      cleanedText = cleanedText.slice(0, -3)
    }
    cleanedText = cleanedText.trim()

    // Parse JSON
    const seoData = JSON.parse(cleanedText) as ProductSEO
    
    // Validate and sanitize
    return {
      metaTitle: sanitizeString(seoData.metaTitle, 60),
      metaDescription: sanitizeString(seoData.metaDescription, 160),
      metaKeywords: Array.isArray(seoData.metaKeywords) 
        ? seoData.metaKeywords.slice(0, 15).map(k => sanitizeString(k, 30))
        : [],
      seoSlug: generateSlugFromText(seoData.seoSlug || product.name),
    }
  } catch (error) {
    console.error("Error generating SEO with Groq:", error)
    return generateFallbackSEO(product)
  }
}

/**
 * Fallback SEO generation when Groq is unavailable
 */
function generateFallbackSEO(product: ProductInput): ProductSEO {
  const typeLabel = product.type === "makeup" ? "Makeup" 
    : product.type === "skincare" ? "Skincare" 
    : "Fragrance"

  return {
    metaTitle: `${product.name} | ${typeLabel} | Glamour Cosmetics Pakistan`.slice(0, 60),
    metaDescription: `Buy ${product.name} for Rs. ${product.price}. ${product.description.slice(0, 80)}. Shop now at Glamour Cosmetics!`.slice(0, 160),
    metaKeywords: [
      product.name.toLowerCase(),
      product.type,
      product.category,
      product.collection.toLowerCase(),
      "glamour cosmetics",
      "beauty products",
      "buy online",
      "pakistan",
      typeLabel.toLowerCase(),
      "cosmetics",
    ],
    seoSlug: generateSlugFromText(product.name),
  }
}

/**
 * Generate URL-friendly slug
 */
function generateSlugFromText(text: string): string {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/\s+/g, "-")
    .replace(/[^\w\-]+/g, "")
    .replace(/\-\-+/g, "-")
    .replace(/^-+/, "")
    .replace(/-+$/, "")
    .slice(0, 50)
}

/**
 * Sanitize string to specific length
 */
function sanitizeString(str: string, maxLength: number): string {
  if (!str || typeof str !== "string") return ""
  return str.trim().slice(0, maxLength)
}

/**
 * Generate product description using Groq AI
 */
export async function generateProductDescription(
  productName: string,
  productType: string,
  category: string,
  briefInfo?: string
): Promise<string | null> {
  if (!GROQ_API_KEY) {
    return null
  }

  const prompt = `You are a copywriter for "Glamour Cosmetics", a premium beauty store in Pakistan. Write a compelling product description for:

Product: ${productName}
Type: ${productType}
Category: ${category}
${briefInfo ? `Additional Info: ${briefInfo}` : ""}

Requirements:
- 2-3 sentences (60-120 words)
- Highlight key benefits and features
- Use engaging, persuasive language
- Mention quality and expected results
- Make it suitable for Pakistani audience
- Do NOT include the price
- Do NOT use asterisks, bullet points, or markdown formatting
- Write in a natural, flowing paragraph style

Return ONLY the description text, nothing else.`

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: [
          {
            role: "system",
            content: "You are a professional copywriter. Write concise, engaging product descriptions."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.8,
        max_tokens: 200,
      }),
    })

    if (!response.ok) {
      return null
    }

    const data = await response.json()
    const text = data.choices?.[0]?.message?.content

    return text?.trim() || null
  } catch (error) {
    console.error("Error generating description:", error)
    return null
  }
}

