import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import bcrypt from "bcryptjs"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { username, email, password, role = "READER" } = body
    const allowedRoles = ["READER", "WRITER"] as const
    const normalizedRole = typeof role === "string" ? role.toUpperCase() : "READER"
    const assignedRole = allowedRoles.includes(normalizedRole as (typeof allowedRoles)[number])
      ? (normalizedRole as (typeof allowedRoles)[number])
      : "READER"

    // Validate input
    if (!username || !email || !password) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [{ email }, { username }],
      },
    })

    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 })
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user
    const user = await prisma.user.create({
      data: {
        username,
        email,
        password: hashedPassword,
  role: assignedRole,
      },
      select: {
        user_id: true,
        username: true,
        email: true,
        role: true,
        created_at: true,
      },
    })

    return NextResponse.json(user, { status: 201 })
  } catch (error) {
    console.error("Registration error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
