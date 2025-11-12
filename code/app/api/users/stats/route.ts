import { NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const session = await auth()

    const role = typeof (session.user as any)?.role === "string" ? (session.user as any).role.toLowerCase() : "reader"

    if (!session || (role !== "admin" && role !== "developer")) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const total = await prisma.user.count()

    return NextResponse.json({ total })
  } catch (error) {
    console.error("[v0] Error fetching user stats:", error)
    return NextResponse.json({ error: "Failed to fetch user stats" }, { status: 500 })
  }
}
