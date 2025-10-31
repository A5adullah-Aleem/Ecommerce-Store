import { NextResponse } from "next/server"

export async function GET() {
  return NextResponse.json(
    {
      success: true,
      message: "Test endpoint working correctly",
      timestamp: new Date().toISOString(),
      data: {
        status: "Backend is running",
        apiUrl: process.env.NEXT_PUBLIC_API_URL || "/api",
      },
    },
    { status: 200 },
  )
}
