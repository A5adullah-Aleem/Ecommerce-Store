"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useForm, useFieldArray } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import { ArrowLeft, Plus, X } from "lucide-react"
import Link from "next/link"
import { useProducts, Product, CreateProductData } from "@/hooks/useProducts"

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

export default function EditProduct({ params }: { params: Promise<{ id: string }> }) {
  const [loading, setLoading] = useState(false)
  const [product, setProduct] = useState<Product | null>(null)
  const [initialLoading, setInitialLoading] = useState(true)
  const router = useRouter()
  const { updateProduct, getProduct } = useProducts()

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: {
      name: "",
      description: "",
      price: 0,
      image: "",
      category: "women",
      collection: "",
      type: "makeup",
      in_stock: true,
      sizes: [],
      colors: [],
    },
  })

  // Watch form values for debugging
  const watchedValues = watch()
  console.log('Form values changed:', watchedValues)

  const { fields: sizeFields, append: appendSize, remove: removeSize } = useFieldArray({
    control,
    name: "sizes",
  })

  const { fields: colorFields, append: appendColor, remove: removeColor } = useFieldArray({
    control,
    name: "colors",
  })

  useEffect(() => {
    let isMounted = true

    const fetchProduct = async () => {
      try {
        const { id } = await params
        const result = await getProduct(id)
        
        if (!isMounted) return // Prevent state updates if component unmounted
        
        if (result.success && result.data) {
          setProduct(result.data)
          // Use setTimeout to ensure the form is ready before resetting
          setTimeout(() => {
            console.log('Resetting form with data:', result.data)
            reset({
              name: result.data.name,
              description: result.data.description,
              price: result.data.price,
              image: result.data.image,
              category: result.data.category,
              collection: result.data.collection,
              type: result.data.type,
              in_stock: result.data.in_stock,
              sizes: result.data.sizes || [],
              colors: result.data.colors || [],
            })
          }, 100)
        } else {
          router.push("/admin")
        }
      } catch (error) {
        console.error("Error fetching product:", error)
        if (isMounted) {
          router.push("/admin")
        }
      } finally {
        if (isMounted) {
          setInitialLoading(false)
        }
      }
    }

    fetchProduct()

    return () => {
      isMounted = false
    }
  }, [params]) // Only depend on params, not on functions

  const onSubmit = async (data: ProductForm) => {
    setLoading(true)
    try {
      const { id } = await params
      const result = await updateProduct(id, data)
      if (result.success) {
        router.push("/admin")
      }
    } catch (error) {
      console.error("Error updating product:", error)
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

  if (initialLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <p className="text-gray-600 mb-6">The product you're looking for doesn't exist.</p>
        <Link
          href="/admin"
          className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Products
        </Link>
      </div>
    )
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
          <h1 className="text-2xl font-bold text-gray-900">Edit Product</h1>
          <p className="text-gray-600">Update product information</p>
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

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Description *
            </label>
            <textarea
              {...register("description")}
              rows={4}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              placeholder="Enter product description"
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

          {/* Category and Type */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Collection *
            </label>
            <input
              {...register("collection")}
              type="text"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-transparent transition-colors"
              placeholder="Enter collection name"
            />
            {errors.collection && (
              <p className="mt-1 text-sm text-red-600">{errors.collection.message}</p>
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
          <div className="flex space-x-4 pt-6 border-t border-gray-200">
            <Link
              href="/admin"
              className="px-6 py-3 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? "Updating..." : "Update Product"}
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  )
}
