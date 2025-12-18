"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, Plus, X, Sparkles, Loader2 } from "lucide-react"
import Link from "next/link"
import { useProducts, CreateProductData } from "@/hooks/useProducts"
import toast from "react-hot-toast"

const productSchema = z.object({
  name: z.string().min(1, "Product name is required"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  price: z.number().min(0, "Price must be a positive number"),
  image: z.string().url("Please enter a valid image URL"),
  category: z.enum(["women", "men", "kids"], {
    required_error: "Please select a category",
  }),
  collection: z.string().min(1, "Collection is required"),
  type: z.enum(["makeup", "skincare", "fragrances"], {
    required_error: "Please select a type",
  }),
  in_stock: z.boolean().default(true),
  sizes: z.array(z.string()).min(1, "At least one size is required"),
  colors: z.array(z.string()).min(1, "At least one color is required"),
})

type ProductForm = z.infer<typeof productSchema>

export default function AddProduct() {
  const [loading, setLoading] = useState(false)
  const [generatingDescription, setGeneratingDescription] = useState(false)
  const router = useRouter()
  const { createProduct } = useProducts()

  const {
    register,
    handleSubmit,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      in_stock: true,
      sizes: ["30ml"],
      colors: ["Red"],
    },
  })

  const { fields: sizeFields, append: appendSize, remove: removeSize } = useFieldArray({
    control,
    name: "sizes",
  })

  const { fields: colorFields, append: appendColor, remove: removeColor } = useFieldArray({
    control,
    name: "colors",
  })

  const watchName = watch("name")
  const watchType = watch("type")
  const watchCategory = watch("category")
  const watchCollection = watch("collection")

  // Generate description using AI
  const generateDescription = async () => {
    if (!watchName) {
      toast.error("Please enter a product name first")
      return
    }
    if (!watchType) {
      toast.error("Please select a product type first")
      return
    }
    if (!watchCategory) {
      toast.error("Please select a category first")
      return
    }
    if (!watchCollection) {
      toast.error("Please enter a collection first")
      return
    }

    setGeneratingDescription(true)
    try {
      const response = await fetch("/api/ai/generate-description", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: watchName,
          type: watchType,
          category: watchCategory,
          collection: watchCollection,
        }),
      })

      const data = await response.json()
      
      if (data.success && data.description) {
        setValue("description", data.description)
        toast.success("✨ AI generated description!")
      } else {
        toast.error(data.error || "Failed to generate description")
      }
    } catch (error) {
      toast.error("Failed to generate description")
    } finally {
      setGeneratingDescription(false)
    }
  }

  const onSubmit = async (data: ProductForm) => {
    setLoading(true)
    try {
      const result = await createProduct(data)
      if (result.success) {
        toast.success("🎉 Product created with AI-generated SEO!")
        router.push("/admin")
      }
    } catch (error) {
      console.error("Error creating product:", error)
      toast.error("Failed to create product")
    } finally {
      setLoading(false)
    }
  }

  const addSize = () => {
    appendSize("")
  }

  const addColor = () => {
    appendColor("")
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center space-x-4">
        <Link
          href="/admin"
          className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
          <p className="text-gray-600">Create a new product with AI-powered SEO</p>
        </div>
      </div>

      {/* AI Info Banner */}
      <div className="bg-gradient-to-r from-purple-50 to-blue-50 border border-purple-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <Sparkles className="w-5 h-5 text-purple-600 mt-0.5" />
          <div>
            <h3 className="font-semibold text-purple-900">AI-Powered SEO</h3>
            <p className="text-sm text-purple-700 mt-1">
              When you save this product, our AI will automatically generate optimized meta title, 
              meta description, and SEO keywords for better search engine visibility.
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-sm border border-gray-200 p-6"
      >
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Product Name *
              </label>
              <input
                {...register("name")}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                placeholder="Enter product name"
              />
              {errors.name && (
                <p className="mt-1 text-sm text-red-600">{errors.name.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Price (PKR) *
              </label>
              <input
                {...register("price", { valueAsNumber: true })}
                type="number"
                step="0.01"
                min="0"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                placeholder="0.00"
              />
              {errors.price && (
                <p className="mt-1 text-sm text-red-600">{errors.price.message}</p>
              )}
            </div>
          </div>

          {/* Category, Type and Collection - Needed for AI generation */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category *
              </label>
              <select
                {...register("category")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              >
                <option value="">Select category</option>
                <option value="women">Women</option>
                <option value="men">Men</option>
                <option value="kids">Kids</option>
              </select>
              {errors.category && (
                <p className="mt-1 text-sm text-red-600">{errors.category.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Type *
              </label>
              <select
                {...register("type")}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              >
                <option value="">Select type</option>
                <option value="makeup">Makeup</option>
                <option value="skincare">Skincare</option>
                <option value="fragrances">Fragrances</option>
              </select>
              {errors.type && (
                <p className="mt-1 text-sm text-red-600">{errors.type.message}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Collection *
              </label>
              <input
                {...register("collection")}
                type="text"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                placeholder="e.g. Summer, Winter"
              />
              {errors.collection && (
                <p className="mt-1 text-sm text-red-600">{errors.collection.message}</p>
              )}
            </div>
          </div>

          {/* Description with AI Generate Button */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Description *
              </label>
              <button
                type="button"
                onClick={generateDescription}
                disabled={generatingDescription || !watchName || !watchType || !watchCategory || !watchCollection}
                className="inline-flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-purple-700 bg-purple-100 rounded-lg hover:bg-purple-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {generatingDescription ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    Generate with AI
                  </>
                )}
              </button>
            </div>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              placeholder="Enter product description or click 'Generate with AI' to auto-generate"
            />
            {errors.description && (
              <p className="mt-1 text-sm text-red-600">{errors.description.message}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Image URL *
            </label>
            <input
              {...register("image")}
              type="url"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              placeholder="https://example.com/image.jpg"
            />
            {errors.image && (
              <p className="mt-1 text-sm text-red-600">{errors.image.message}</p>
            )}
          </div>

          {/* Stock Status */}
          <div>
            <label className="flex items-center space-x-3">
              <input
                {...register("in_stock")}
                type="checkbox"
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <span className="text-sm font-medium text-gray-700">In Stock</span>
            </label>
          </div>

          {/* Sizes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Sizes *
            </label>
            <div className="space-y-2">
              {sizeFields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <input
                    {...register(`sizes.${index}`)}
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="Enter size"
                  />
                  <button
                    type="button"
                    onClick={() => removeSize(index)}
                    className="p-2 text-red-600 hover:text-red-800 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addSize}
                className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm">Add Size</span>
              </button>
            </div>
            {errors.sizes && (
              <p className="mt-1 text-sm text-red-600">{errors.sizes.message}</p>
            )}
          </div>

          {/* Colors */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Available Colors *
            </label>
            <div className="space-y-2">
              {colorFields.map((field, index) => (
                <div key={field.id} className="flex items-center space-x-2">
                  <input
                    {...register(`colors.${index}`)}
                    type="text"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
                    placeholder="Enter color"
                  />
                  <button
                    type="button"
                    onClick={() => removeColor(index)}
                    className="p-2 text-red-600 hover:text-red-800 transition-colors"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addColor}
                className="flex items-center space-x-2 text-primary hover:text-primary/80 transition-colors"
              >
                <Plus className="h-4 w-4" />
                <span className="text-sm">Add Color</span>
              </button>
            </div>
            {errors.colors && (
              <p className="mt-1 text-sm text-red-600">{errors.colors.message}</p>
            )}
          </div>

          {/* Form Actions */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
            <Link
              href="/admin"
              className="px-6 py-3 text-center text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 sm:flex-none px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors inline-flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Creating with AI SEO...
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  Create Product
                </>
              )}
            </button>
          </div>

          {/* SEO Preview */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h3 className="text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-600" />
              AI will generate on save:
            </h3>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• <strong>Meta Title:</strong> SEO-optimized title for search engines</li>
              <li>• <strong>Meta Description:</strong> Compelling description for search results</li>
              <li>• <strong>Keywords:</strong> Relevant SEO keywords for better ranking</li>
              <li>• <strong>URL Slug:</strong> Clean, SEO-friendly URL path</li>
            </ul>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
