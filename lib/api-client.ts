import axios from "axios"

const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  // Check if we're in the browser environment
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("adminToken")
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
  }
  return config
})

export const apiClient = {
  // Products
  getProducts: async (filters?: { type?: string; collection?: string; featured?: boolean }) => {
    const params = new URLSearchParams()
    if (filters?.type) params.append("type", filters.type)
    if (filters?.collection) params.append("collection", filters.collection)
    if (filters?.featured) params.append("featured", "true")

    try {
      const response = await api.get(`/products?${params}`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Failed to fetch products",
      }
    }
  },

  getProduct: async (id: string) => {
    try {
      const response = await api.get(`/products/${id}`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Failed to fetch product",
      }
    }
  },

  createProduct: async (productData: any) => {
    try {
      const response = await api.post("/products", productData)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Failed to create product",
      }
    }
  },

  updateProduct: async (id: string, productData: any) => {
    try {
      const response = await api.put(`/products/${id}`, productData)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Failed to update product",
      }
    }
  },

  deleteProduct: async (id: string) => {
    try {
      const response = await api.delete(`/products/${id}`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Failed to delete product",
      }
    }
  },

  // Collections
  getCollections: async (filters?: { type?: string }) => {
    const params = new URLSearchParams()
    if (filters?.type) params.append("type", filters.type)

    try {
      const response = await api.get(`/collections?${params}`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Failed to fetch collections",
      }
    }
  },

  getCollection: async (id: string) => {
    try {
      const response = await api.get(`/collections/${id}`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Failed to fetch collection",
      }
    }
  },

  createCollection: async (collectionData: any) => {
    try {
      const response = await api.post("/collections", collectionData)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Failed to create collection",
      }
    }
  },

  updateCollection: async (id: string, collectionData: any) => {
    try {
      const response = await api.put(`/collections/${id}`, collectionData)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Failed to update collection",
      }
    }
  },

  deleteCollection: async (id: string) => {
    try {
      const response = await api.delete(`/collections/${id}`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Failed to delete collection",
      }
    }
  },

  // Orders
  createOrder: async (orderData: any) => {
    try {
      const response = await api.post("/orders", orderData)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Failed to create order",
      }
    }
  },

  getOrders: async () => {
    try {
      const response = await api.get("/orders")
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Failed to fetch orders",
      }
    }
  },

  getOrder: async (id: string) => {
    try {
      const response = await api.get(`/orders/${id}`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Failed to fetch order",
      }
    }
  },

  updateOrder: async (id: string, orderData: any) => {
    try {
      const response = await api.put(`/orders/${id}`, orderData)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Failed to update order",
      }
    }
  },

  deleteOrder: async (id: string) => {
    try {
      const response = await api.delete(`/orders/${id}`)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Failed to delete order",
      }
    }
  },

  // Contact
  submitContact: async (contactData: any) => {
    try {
      const response = await api.post("/contact", contactData)
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Failed to submit contact",
      }
    }
  },

  getContactMessages: async () => {
    try {
      const response = await api.get("/contact")
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Failed to fetch contact messages",
      }
    }
  },

  // Auth
  adminLogin: async (email: string, password: string) => {
    try {
      const response = await api.post("/auth/login", { email, password })
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Failed to login",
      }
    }
  },

  adminRegister: async (email: string, password: string, name?: string) => {
    try {
      const response = await api.post("/auth/register", { email, password, name })
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Failed to register",
      }
    }
  },

  // Health Check
  healthCheck: async () => {
    try {
      const response = await api.get("/health")
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Health check failed",
      }
    }
  },

  // Test Endpoint
  testConnection: async () => {
    try {
      const response = await api.get("/test")
      return response.data
    } catch (error: any) {
      return {
        success: false,
        error: error.response?.data?.error || error.message || "Test connection failed",
      }
    }
  },
}
