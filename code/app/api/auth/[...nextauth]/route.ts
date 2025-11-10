import { NextResponse } from "next/server"
import prisma from "@/lib/prisma"

export async function GET() {
  try {
    const total = await prisma.novel.count()

    const pending = await prisma.novel.count({
      where: {
        status: "PENDING_APPROVAL"
      }
    })

    return NextResponse.json({ total, pending })
  } catch (error) {
    console.error("Error fetching novel stats:", error)
    return NextResponse.json({ total: 0, pending: 0 }, { status: 500 })
  }
}
