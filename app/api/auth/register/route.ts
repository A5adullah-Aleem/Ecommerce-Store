import { supabase } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and password are required",
        },
        { status: 400 },
      )
    }

    const { data: existingAdmin } = await supabase
      .from('admins')
      .select('id')
      .eq('email', email)
      .single()

    if (existingAdmin) {
      return NextResponse.json(
        {
          success: false,
          error: "Email already registered",
        },
        { status: 400 },
      )
    }

    const hashedPassword = await bcrypt.hash(password, 10)

    const { data: admin, error } = await supabase
      .from('admins')
      .insert([{
        email,
        password: hashedPassword,
        name: name || "Admin",
        role: "admin",
      }])
      .select()
      .single()

    if (error) {
      throw error
    }

    const token = jwt.sign(
      {
        id: admin.id,
        email: admin.email,
        role: admin.role,
      },
      JWT_SECRET,
      { expiresIn: "7d" },
    )

    return NextResponse.json(
      {
        success: true,
        data: {
          token,
          admin: {
            id: admin.id,
            email: admin.email,
            name: admin.name,
            role: admin.role,
          },
        },
      },
      { status: 201 },
    )
  } catch (error) {
    console.error("[v0] Register error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to register",
      },
      { status: 500 },
    )
  }
}
