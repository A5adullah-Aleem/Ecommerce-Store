"use client"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { motion } from "framer-motion"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Hero Section */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-5xl font-serif font-bold mb-4">About Glamour Cosmetics</h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Enhancing beauty and confidence for over a decade
          </p>
        </motion.div>

        {/* Story Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <img src="/fashion-boutique-interior.png" alt="Our Store" className="rounded-lg shadow-lg" />
          </motion.div>

          <motion.div initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.6 }}>
            <h2 className="text-3xl font-serif font-bold mb-6">Our Story</h2>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              Glamour Cosmetics was founded with a passion for bringing premium, high-quality beauty products to women who
              appreciate luxury and effectiveness. What started as a small beauty boutique has grown into a trusted name in the
              cosmetics industry.
            </p>
            <p className="text-muted-foreground mb-4 leading-relaxed">
              We believe that every woman deserves to feel confident and beautiful in her own skin. Our carefully
              curated collections of makeup, skincare, and fragrances are designed to enhance natural beauty and boost confidence.
            </p>
            <p className="text-muted-foreground leading-relaxed">
              Today, we continue to uphold our commitment to quality, innovation, and customer satisfaction, serving
              thousands of happy customers across the country with our premium beauty products.
            </p>
          </motion.div>
        </div>

        {/* Mission & Values */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          {[
            {
              title: "Our Mission",
              description:
                "To provide premium quality beauty products that empower women to express their unique beauty and confidence.",
            },
            {
              title: "Our Vision",
              description:
                "To be the leading beauty destination known for luxury, quality, and exceptional customer service.",
            },
            {
              title: "Our Values",
              description: "Quality, innovation, authenticity, and customer-centricity guide everything we do.",
            },
          ].map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1, duration: 0.6 }}
              className="bg-secondary/30 rounded-lg p-8 text-center"
            >
              <h3 className="text-2xl font-serif font-bold mb-4">{item.title}</h3>
              <p className="text-muted-foreground">{item.description}</p>
            </motion.div>
          ))}
        </div>

        {/* Team Section */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-serif font-bold mb-4">Meet Our Team</h2>
          <p className="text-muted-foreground text-lg mb-12">Passionate professionals dedicated to your satisfaction</p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { name: "Fatima Malik", role: "Founder & Beauty Expert" },
              { name: "Ayesha Khan", role: "Product Development Manager" },
              { name: "Zainab Ahmed", role: "Customer Relations" },
            ].map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.6 }}
                className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow"
              >
                <img
                  src={`/professional-woman-.jpg?height=300&width=300&query=professional%20woman%20${index}`}
                  alt={member.name}
                  className="w-full h-64 object-cover"
                />
                <div className="p-6 text-center">
                  <h3 className="font-serif font-bold text-lg">{member.name}</h3>
                  <p className="text-primary text-sm">{member.role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
