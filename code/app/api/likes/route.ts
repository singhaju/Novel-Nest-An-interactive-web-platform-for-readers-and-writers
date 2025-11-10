import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST /api/likes - Toggle like (not in original backend, adding for frontend compatibility)
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { novelId } = body

    if (!novelId) {
      return NextResponse.json({ error: "Novel ID is required" }, { status: 400 })
    }

    const userId = Number.parseInt((session.user as any).id)

    // Check if already liked (we need to create a Likes table in schema)
    // For now, we'll just increment/decrement the likes count on the novel
    const novel = await prisma.novel.findUnique({
      where: { novel_id: novelId },
    })

    if (!novel) {
      return NextResponse.json({ error: "Novel not found" }, { status: 404 })
    }

    // Toggle like (simplified - in production you'd have a separate likes table)
    // This is a placeholder implementation
    return NextResponse.json({ action: "added" })
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 })
  }
}
