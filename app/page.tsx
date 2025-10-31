"use client";

import { Header } from "@/components/header";
import { Footer } from "@/components/footer";
import { ProductCard } from "@/components/product-card";
import { Button } from "@/components/ui/button";
import { testimonials, whyChooseUs } from "@/lib/dummy-data";
import { useProducts } from "@/hooks/useProducts";
import Link from "next/link";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import Head from "next/head"; // ✅ Import Head for SEO

export default function Home() {
  const { getProducts } = useProducts();
  const [featuredProducts, setFeaturedProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        if (typeof getProducts !== "function") {
          setFeaturedProducts([]);
          setLoading(false);
          return;
        }

        const result = await getProducts({ featured: true });
        if (result.success && result.data) {
          setFeaturedProducts(result.data.slice(0, 6));
        } else {
          setFeaturedProducts([]);
        }
      } catch (error) {
        setFeaturedProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="min-h-screen bg-white">
      {/* SEO Meta Tags */}
      <Head>
        <title>Glamour Cosmetics - Premium Makeup, Skincare & Fragrances</title>
        <meta
          name="description"
          content="Discover your inner beauty with Glamour Cosmetics. Explore our premium collection of makeup, skincare, and fragrances."
        />
        <meta name="robots" content="index, follow" />
        <meta
          property="og:title"
          content="Glamour Cosmetics - Premium Makeup, Skincare & Fragrances"
        />
        <meta
          property="og:description"
          content="Discover your inner beauty with Glamour Cosmetics. Explore our premium collection of makeup, skincare, and fragrances."
        />
        <meta property="og:type" content="website" />
      </Head>

      <Header />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary/10 to-secondary/20 py-20 md:py-32">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center"
          >
            <h1 className="text-5xl md:text-6xl font-serif font-bold mb-4 text-primary">
              Glamour Cosmetics
            </h1>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Discover your inner beauty with our premium collection of makeup,
              skincare, and fragrances
            </p>
            <Link href="/collection">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg">
                Shop Now
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-serif font-bold mb-4">
              Our Beauty Collection
            </h2>
            <p className="text-muted-foreground text-lg">
              Discover our premium collection of makeup, skincare, and
              fragrances
            </p>
          </motion.div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
            </div>
          ) : featuredProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              {featuredProducts.slice(0, 8).map((product, index) => (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                >
                  <ProductCard
                    id={product.id}
                    name={product.name}
                    price={product.price}
                    image={product.image}
                    type={product.type}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground text-lg">
                No products available at the moment.
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                Check back soon for our latest collection!
              </p>
            </div>
          )}

          <div className="text-center mt-12">
            <Link href="/collection">
              <Button className="bg-primary hover:bg-primary/90 text-white px-8 py-6 text-lg">
                View All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-serif font-bold mb-4">
              Why Choose Glamour
            </h2>
            <p className="text-muted-foreground text-lg">
              Experience the Glamour Cosmetics difference
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {whyChooseUs.map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="text-4xl mb-4">{item.icon}</div>
                <h3 className="font-serif font-bold text-lg mb-2">
                  {item.title}
                </h3>
                <p className="text-muted-foreground text-sm">
                  {item.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="max-w-7xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-serif font-bold mb-4">
              What Our Customers Say
            </h2>
            <p className="text-muted-foreground text-lg">
              Join thousands of satisfied customers
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <span key={i} className="text-yellow-400">
                      ★
                    </span>
                  ))}
                </div>
                <p className="text-muted-foreground mb-4 italic">
                  "{testimonial.text}"
                </p>
                <p className="font-serif font-bold">{testimonial.name}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
