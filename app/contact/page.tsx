"use client"

import type React from "react"

import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Mail, Phone, MapPin, Clock } from "lucide-react"
import { useState } from "react"
import { motion } from "framer-motion"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })
  const [submitted, setSubmitted] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Here you would typically send the form data to your backend
    console.log("Form submitted:", formData)
    setSubmitted(true)
    setFormData({ name: "", email: "", message: "" })
    setTimeout(() => setSubmitted(false), 3000)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header />

      <div className="max-w-7xl mx-auto px-4 py-12">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-16">
          <h1 className="text-5xl font-serif font-bold mb-4">Get In Touch</h1>
          <p className="text-xl text-muted-foreground">We'd love to hear from you. Send us a message!</p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
          {/* Contact Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
          >
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block text-sm font-semibold mb-2">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="Your name"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
                  placeholder="your@email.com"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2">Message</label>
                <textarea
                  name="message"
                  value={formData.message}
                  onChange={handleChange}
                  required
                  rows={5}
                  className="w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary resize-none"
                  placeholder="Your message..."
                />
              </div>

              <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white py-3 text-lg">
                Send Message
              </Button>

              {submitted && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg"
                >
                  Thank you! We'll get back to you soon.
                </motion.div>
              )}
            </form>
          </motion.div>

          {/* Contact Information */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            {[
              {
                icon: Phone,
                title: "Phone",
                content: "+92 3159454000",
              },
              {
                icon: Mail,
                title: "Email",
                content: "info@glamourcosmetics.com",
              },
              {
                icon: MapPin,
                title: "Address",
                content: "123 Beauty Avenue, Lahore, Pakistan",
              },
              {
                icon: Clock,
                title: "Business Hours",
                content: "Mon - Sat: 10:00 AM - 8:00 PM\nSun: 12:00 PM - 6:00 PM",
              },
            ].map((item, index) => {
              const Icon = item.icon
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.6 }}
                  className="flex gap-4"
                >
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-lg bg-primary/10">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                  </div>
                  <div>
                    <h3 className="font-serif font-bold text-lg">{item.title}</h3>
                    <p className="text-muted-foreground whitespace-pre-line">{item.content}</p>
                  </div>
                </motion.div>
              )
            })}
          </motion.div>
        </div>

        {/* Map Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="bg-secondary/20 rounded-lg overflow-hidden h-96"
        >
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3401.5234567890!2d74.3587!3d31.5204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2zMzHCsDMxJzEyLjEiTiA3NMKwMjEnMzEuMiJF!5e0!3m2!1sen!2s!4v1234567890"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </motion.div>
      </div>

      <Footer />
    </div>
  )
}
