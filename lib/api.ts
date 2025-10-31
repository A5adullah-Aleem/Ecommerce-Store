const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "/api"

export interface Product {
  id: string
  name: string
  description: string
  price: number
  image: string
  category: string
  collection: string
  type: "stitched" | "unstitched"
  in_stock: boolean
  created_at: string
}

export interface Collection {
  id: string
  name: string
  description: string
  image: string
  type: string
  productCount: number
}

export interface Order {
  id: string
  customer_name: string
  email: string
  phone: string
  address: string
  city?: string
  postal_code?: string
  items: Array<{ productId: string; quantity: number; price: number }>
  total_amount: number
  status: "pending" | "processing" | "shipped" | "delivered" | "cancelled"
  created_at: string
  updated_at: string
}

export interface ContactMessage {
  id: string
  name: string
  email: string
  phone: string
  message: string
  created_at: string
}

// Products API
export async function getProducts(filters?: { collection?: string; type?: string }) {
  try {
    const params = new URLSearchParams()
    if (filters?.collection) params.append("collection", filters.collection)
    if (filters?.type) params.append("type", filters.type)

    const response = await fetch(`${API_BASE_URL}/products?${params}`)
    if (!response.ok) throw new Error("Failed to fetch products")
    const result = await response.json()
    return result.data || result
  } catch (error) {
    console.error("Error fetching products:", error)
    throw error
  }
}

export async function getProductById(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`)
    if (!response.ok) throw new Error("Failed to fetch product")
    const result = await response.json()
    return result.data || result
  } catch (error) {
    console.error("Error fetching product:", error)
    throw error
  }
}

export async function createProduct(data: Partial<Product>, token?: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/products`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to create product")
    const result = await response.json()
    return result.data || result
  } catch (error) {
    console.error("Error creating product:", error)
    throw error
  }
}

export async function updateProduct(id: string, data: Partial<Product>, token?: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to update product")
    const result = await response.json()
    return result.data || result
  } catch (error) {
    console.error("Error updating product:", error)
    throw error
  }
}

export async function deleteProduct(id: string, token?: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/products/${id}`, {
      method: "DELETE",
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
    if (!response.ok) throw new Error("Failed to delete product")
    const result = await response.json()
    return result
  } catch (error) {
    console.error("Error deleting product:", error)
    throw error
  }
}

// Collections API
export async function getCollections() {
  try {
    const response = await fetch(`${API_BASE_URL}/collections`)
    if (!response.ok) throw new Error("Failed to fetch collections")
    const result = await response.json()
    return result.data || result
  } catch (error) {
    console.error("Error fetching collections:", error)
    throw error
  }
}

export async function getCollectionById(id: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/collections/${id}`)
    if (!response.ok) throw new Error("Failed to fetch collection")
    const result = await response.json()
    return result.data || result
  } catch (error) {
    console.error("Error fetching collection:", error)
    throw error
  }
}

// Orders API
export async function createOrder(data: Partial<Order>) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to create order")
    const result = await response.json()
    return result.data || result
  } catch (error) {
    console.error("Error creating order:", error)
    throw error
  }
}

export async function getOrders(token?: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
    if (!response.ok) throw new Error("Failed to fetch orders")
    const result = await response.json()
    return result.data || result
  } catch (error) {
    console.error("Error fetching orders:", error)
    throw error
  }
}

export async function updateOrderStatus(id: string, status: string, token?: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/orders/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token && { Authorization: `Bearer ${token}` }),
      },
      body: JSON.stringify({ status }),
    })
    if (!response.ok) throw new Error("Failed to update order")
    const result = await response.json()
    return result.data || result
  } catch (error) {
    console.error("Error updating order:", error)
    throw error
  }
}

// Contact API
export async function submitContactForm(data: Partial<ContactMessage>) {
  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
    if (!response.ok) throw new Error("Failed to submit contact form")
    const result = await response.json()
    return result.data || result
  } catch (error) {
    console.error("Error submitting contact form:", error)
    throw error
  }
}

export async function getContactMessages(token?: string) {
  try {
    const response = await fetch(`${API_BASE_URL}/contact`, {
      headers: {
        ...(token && { Authorization: `Bearer ${token}` }),
      },
    })
    if (!response.ok) throw new Error("Failed to fetch messages")
    const result = await response.json()
    return result.data || result
  } catch (error) {
    console.error("Error fetching messages:", error)
    throw error
  }
}
