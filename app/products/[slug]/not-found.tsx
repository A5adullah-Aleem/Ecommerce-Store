import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import Link from "next/link"
import { Search, Home, ShoppingBag } from "lucide-react"

export default function ProductNotFound() {
  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          {/* 404 Icon */}
          <div className="mb-8">
            <div className="w-24 h-24 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
              <Search className="w-12 h-12 text-primary" />
            </div>
          </div>
          
          {/* Error Message */}
          <h1 className="text-4xl font-serif font-bold text-foreground mb-4">
            Product Not Found
          </h1>
          <p className="text-muted-foreground text-lg mb-8">
            Sorry, we couldn't find the product you're looking for. 
            It may have been removed or the URL might be incorrect.
          </p>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors font-medium"
            >
              <Home className="w-5 h-5" />
              Go Home
            </Link>
            <Link
              href="/collection"
              className="inline-flex items-center justify-center gap-2 px-6 py-3 border-2 border-primary text-primary rounded-lg hover:bg-primary/10 transition-colors font-medium"
            >
              <ShoppingBag className="w-5 h-5" />
              Browse Products
            </Link>
          </div>
          
          {/* Help Text */}
          <p className="text-sm text-muted-foreground mt-8">
            Need help? <Link href="/contact" className="text-primary hover:underline">Contact us</Link>
          </p>
        </div>
      </main>
      
      <Footer />
    </div>
  )
}

