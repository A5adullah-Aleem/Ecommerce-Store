"use client";

import { useState, useEffect } from "react";
import { apiClient } from "@/lib/api-client";
import toast from "react-hot-toast";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
  category: "women" | "men" | "kids";
  collection: string;
  type: "makeup" | "skincare" | "fragrances";
  in_stock: boolean;
  sizes: string[];
  colors: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateProductData {
  name: string;
  description: string;
  price: number;
  image: string;
  category: "women" | "men" | "kids";
  collection: string;
  type: "makeup" | "skincare" | "fragrances";
  in_stock: boolean;
  sizes: string[];
  colors: string[];
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getProducts();

      if (response.success) {
        setProducts(response.data || []);
      } else {
        setError(response.error || "Failed to fetch products");
        toast.error(response.error || "Failed to fetch products");
      }
    } catch (err) {
      const errorMessage = "An error occurred while fetching products";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const createProduct = async (productData: CreateProductData) => {
    try {
      const response = await apiClient.createProduct(productData);

      if (response.success) {
        toast.success("Product created successfully!");
        await fetchProducts(); // Refresh the list
        return { success: true, data: response.data };
      } else {
        toast.error(response.error || "Failed to create product");
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMessage = "An error occurred while creating product";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateProduct = async (
    id: string,
    productData: Partial<CreateProductData>
  ) => {
    try {
      const response = await apiClient.updateProduct(id, productData);

      if (response.success) {
        toast.success("Product updated successfully!");
        await fetchProducts(); // Refresh the list
        return { success: true, data: response.data };
      } else {
        toast.error(response.error || "Failed to update product");
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMessage = "An error occurred while updating product";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const response = await apiClient.deleteProduct(id);

      if (response.success) {
        toast.success("Product deleted successfully!");
        await fetchProducts(); // Refresh the list
        return { success: true };
      } else {
        toast.error(response.error || "Failed to delete product");
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMessage = "An error occurred while deleting product";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const getProducts = async (filters?: {
    type?: string;
    collection?: string;
    featured?: boolean;
  }) => {
    try {
      console.log("getProducts called with filters:", filters);
      const response = await apiClient.getProducts(filters);
      console.log("getProducts response:", response);

      if (response.success) {
        return { success: true, data: response.data };
      } else {
        return { success: false, error: response.error };
      }
    } catch (err) {
      console.error("getProducts error:", err);
      const errorMessage = "An error occurred while fetching products";
      return { success: false, error: errorMessage };
    }
  };

  const getProduct = async (id: string) => {
    try {
      const response = await apiClient.getProduct(id);

      if (response.success) {
        return { success: true, data: response.data };
      } else {
        toast.error(response.error || "Failed to fetch product");
        return { success: false, error: response.error };
      }
    } catch (err) {
      const errorMessage = "An error occurred while fetching product";
      toast.error(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return {
    products,
    loading,
    error,
    fetchProducts,
    getProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProduct,
  };
}
