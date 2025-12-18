import { Metadata } from "next"
import { supabase } from "@/lib/supabase"
import { notFound } from "next/navigation"
import ProductPageClient from "./ProductPageClient"

// Types
interface Product {
  id: string
  name: string
  slug: string
  description: string
  price: number
  image: string
  category: "women" | "men" | "kids"
  collection: string
  type: "makeup" | "skincare" | "fragrances"
  in_stock: boolean
  sizes: string[]
  colors: string[]
  meta_title: string | null
  meta_description: string | null
  meta_keywords: string[]
  created_at: string
  updated_at: string
}

interface Props {
  params: Promise<{ slug: string }>
}

// Fetch product by slug from Supabase
async function getProductBySlug(slug: string): Promise<Product | null> {
  const { data, error } = await supabase
    .from("products")
    .select("*")
    .eq("slug", slug)
    .single()

  if (error || !data) {
    return null
  }

  return data as Product
}

// Generate dynamic metadata for SEO
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const product = await getProductBySlug(slug)

  if (!product) {
    return {
      title: "Product Not Found | Glamour Cosmetics",
      description: "The product you are looking for could not be found.",
      robots: {
        index: false,
        follow: false,
      },
    }
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://glamourcosmetics.com"
  const productUrl = `${siteUrl}/products/${product.slug}`
  const productImage = product.image.startsWith("http")
    ? product.image
    : `${siteUrl}${product.image}`

  // Use AI-generated SEO data if available, otherwise fallback
  const metaTitle = product.meta_title || 
    `${product.name} | ${product.type.charAt(0).toUpperCase() + product.type.slice(1)} | Glamour Cosmetics`
  
  // Use AI-generated meta description if available
  let metaDescription: string
  if (product.meta_description) {
    metaDescription = product.meta_description
  } else {
    const shortDescription = product.description.length > 120
      ? product.description.slice(0, 117) + "..."
      : product.description
    metaDescription = `${product.name} - ${shortDescription} Only Rs. ${product.price.toLocaleString()}. Shop now at Glamour Cosmetics.`
  }

  // Use AI-generated keywords if available, otherwise fallback
  let keywords: string
  if (product.meta_keywords && product.meta_keywords.length > 0) {
    keywords = product.meta_keywords.join(", ")
  } else {
    const typeKeywords: Record<string, string[]> = {
      makeup: ["makeup", "cosmetics", "beauty", "lipstick", "foundation", "eyeshadow"],
      skincare: ["skincare", "skin care", "moisturizer", "serum", "face cream", "beauty routine"],
      fragrances: ["fragrance", "perfume", "cologne", "scent", "eau de parfum", "body spray"],
    }
    keywords = [
      product.name,
      product.type,
      product.category,
      product.collection,
      "Glamour Cosmetics",
      "beauty products",
      "Pakistan",
      "buy online",
      ...(typeKeywords[product.type] || []),
    ].join(", ")
  }

  return {
    title: metaTitle,
    description: metaDescription.slice(0, 160),
    keywords: keywords,
    authors: [{ name: "Glamour Cosmetics" }],
    creator: "Glamour Cosmetics",
    publisher: "Glamour Cosmetics",
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-video-preview": -1,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url: productUrl,
      siteName: "Glamour Cosmetics",
      title: product.name,
      description: metaDescription.slice(0, 160),
      images: [
        {
          url: productImage,
          width: 1200,
          height: 630,
          alt: product.name,
          type: "image/jpeg",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: product.name,
      description: metaDescription.slice(0, 160),
      images: [productImage],
      creator: "@glamourcosmetics",
      site: "@glamourcosmetics",
    },
    alternates: {
      canonical: productUrl,
    },
    other: {
      "product:price:amount": product.price.toString(),
      "product:price:currency": "PKR",
      "product:availability": product.in_stock ? "in stock" : "out of stock",
      "product:category": product.type,
    },
  }
}

// Generate static params for popular products (optional - improves performance)
export async function generateStaticParams() {
  const { data: products } = await supabase
    .from("products")
    .select("slug")
    .limit(50)

  if (!products) return []

  return products.map((product) => ({
    slug: product.slug,
  }))
}

// Server component - fetches data on server
export default async function ProductPage({ params }: Props) {
  const { slug } = await params
  
  // Fetch product by slug
  const product = await getProductBySlug(slug)

  // Return 404 if product not found
  if (!product) {
    notFound()
  }

  // JSON-LD structured data for rich snippets in search results
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://glamourcosmetics.com"
  const productImage = product.image.startsWith("http")
    ? product.image
    : `${siteUrl}${product.image}`

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.description,
    image: productImage,
    sku: product.id,
    mpn: product.id.slice(0, 8).toUpperCase(),
    brand: {
      "@type": "Brand",
      name: "Glamour Cosmetics",
    },
    offers: {
      "@type": "Offer",
      url: `${siteUrl}/products/${product.slug}`,
      priceCurrency: "PKR",
      price: product.price,
      availability: product.in_stock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: "Glamour Cosmetics",
      },
    },
    category: product.type,
    additionalProperty: [
      {
        "@type": "PropertyValue",
        name: "Category",
        value: product.category,
      },
      {
        "@type": "PropertyValue",
        name: "Collection",
        value: product.collection,
      },
    ],
  }

  // BreadcrumbList for SEO
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: siteUrl,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Products",
        item: `${siteUrl}/collection`,
      },
      {
        "@type": "ListItem",
        position: 3,
        name: product.type.charAt(0).toUpperCase() + product.type.slice(1),
        item: `${siteUrl}/collection?type=${product.type}`,
      },
      {
        "@type": "ListItem",
        position: 4,
        name: product.name,
        item: `${siteUrl}/products/${product.slug}`,
      },
    ],
  }

  return (
    <>
      {/* JSON-LD Structured Data for Product */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {/* JSON-LD Structured Data for Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />
      <ProductPageClient product={product} />
    </>
  )
}

