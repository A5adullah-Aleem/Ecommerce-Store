import { supabase } from "@/lib/supabase"
import { type NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key-change-in-production"

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        {
          success: false,
          error: "Email and password are required",
        },
        { status: 400 },
      )
    }

    const { data: admin, error } = await supabase
      .from('admins')
      .select('*')
      .eq('email', email)
      .single()

    if (error || !admin) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 },
      )
    }

    const isPasswordValid = await bcrypt.compare(password, admin.password)

    if (!isPasswordValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid email or password",
        },
        { status: 401 },
      )
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
      { status: 200 },
    )
  } catch (error) {
    console.error("[v0] Login error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Failed to login",
      },
      { status: 500 },
    )
  }
}
