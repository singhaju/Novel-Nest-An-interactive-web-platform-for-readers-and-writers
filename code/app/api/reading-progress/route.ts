import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST /api/reading-progress - Update reading progress
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { novelId, episodeId } = body

    if (!novelId || !episodeId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const userId = Number.parseInt((session.user as any).id)

    await prisma.$executeRaw`CALL UpdateReadingProgress(${userId}, ${novelId}, ${episodeId})`

    const progress = await prisma.userReadingProgress.findUnique({
      where: {
        user_id_novel_id: {
          user_id: userId,
          novel_id: novelId,
        },
      },
    })

    if (!progress) {
      return NextResponse.json({ error: "Failed to persist reading progress" }, { status: 500 })
    }

    return NextResponse.json(progress)
  } catch (error) {
    console.error("Error updating reading progress:", error)
    return NextResponse.json({ error: "Failed to update reading progress" }, { status: 500 })
  }
}
