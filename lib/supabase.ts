import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

// Check if environment variables are properly set
if (supabaseUrl === 'https://placeholder.supabase.co' || supabaseAnonKey === 'placeholder-key') {
  console.error('⚠️  Supabase environment variables are not set!')
  console.error('Please create a .env.local file with your Supabase credentials.')
  console.error('Required variables:')
  console.error('- NEXT_PUBLIC_SUPABASE_URL')
  console.error('- NEXT_PUBLIC_SUPABASE_ANON_KEY')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Database {
  public: {
    Tables: {
      products: {
        Row: {
          id: string
          name: string
          description: string
          price: number
          image: string
          category: 'women' | 'men' | 'kids'
          collection: string
          type: 'stitched' | 'unstitched'
          in_stock: boolean
          sizes: string[]
          colors: string[]
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          price: number
          image: string
          category?: 'women' | 'men' | 'kids'
          collection: string
          type: 'stitched' | 'unstitched'
          in_stock?: boolean
          sizes?: string[]
          colors?: string[]
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          price?: number
          image?: string
          category?: 'women' | 'men' | 'kids'
          collection?: string
          type?: 'stitched' | 'unstitched'
          in_stock?: boolean
          sizes?: string[]
          colors?: string[]
          created_at?: string
          updated_at?: string
        }
      }
      collections: {
        Row: {
          id: string
          name: string
          description: string
          image: string
          type: 'stitched' | 'unstitched' | 'seasonal'
          product_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description: string
          image: string
          type: 'stitched' | 'unstitched' | 'seasonal'
          product_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string
          image?: string
          type?: 'stitched' | 'unstitched' | 'seasonal'
          product_count?: number
          created_at?: string
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          customer_name: string
          email: string
          phone: string
          address: string
          city: string | null
          postal_code: string | null
          items: {
            product_id: string
            product_name: string
            quantity: number
            price: number
          }[]
          total_amount: number
          status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          customer_name: string
          email: string
          phone: string
          address: string
          city?: string | null
          postal_code?: string | null
          items: {
            product_id: string
            product_name: string
            quantity: number
            price: number
          }[]
          total_amount: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          customer_name?: string
          email?: string
          phone?: string
          address?: string
          city?: string | null
          postal_code?: string | null
          items?: {
            product_id: string
            product_name: string
            quantity: number
            price: number
          }[]
          total_amount?: number
          status?: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
          created_at?: string
          updated_at?: string
        }
      }
      contacts: {
        Row: {
          id: string
          name: string
          email: string
          phone: string
          message: string
          status: 'new' | 'read' | 'replied'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          email: string
          phone: string
          message: string
          status?: 'new' | 'read' | 'replied'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          email?: string
          phone?: string
          message?: string
          status?: 'new' | 'read' | 'replied'
          created_at?: string
          updated_at?: string
        }
      }
      admins: {
        Row: {
          id: string
          email: string
          password: string
          name: string | null
          role: 'admin' | 'superadmin'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          email: string
          password: string
          name?: string | null
          role?: 'admin' | 'superadmin'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          password?: string
          name?: string | null
          role?: 'admin' | 'superadmin'
          created_at?: string
          updated_at?: string
        }
      }
    }
  }
}

export type Tables<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Row']
export type TablesInsert<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Insert']
export type TablesUpdate<T extends keyof Database['public']['Tables']> = Database['public']['Tables'][T]['Update']
