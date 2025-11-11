import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/likes?userId=X&novelId=Y - Check if user has liked a novel
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const userId = Number.parseInt(searchParams.get("userId") || "0")
    const novelId = Number.parseInt(searchParams.get("novelId") || "0")

    if (!userId || !novelId) {
      return NextResponse.json({ liked: false }, { status: 200 })
    }

    const like = await prisma.novelLike.findUnique({
      where: {
        user_id_novel_id: {
          user_id: userId,
          novel_id: novelId,
        },
      },
    })

    return NextResponse.json({ liked: !!like }, { status: 200 })
  } catch (error) {
    console.error("Error checking like status:", error)
    return NextResponse.json({ liked: false }, { status: 500 })
  }
}

// POST /api/likes - Toggle like
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

    // Check if novel exists
    const novel = await prisma.novel.findUnique({
      where: { novel_id: novelId },
    })

    if (!novel) {
      return NextResponse.json({ error: "Novel not found" }, { status: 404 })
    }

    // Check if already liked
    const existingLike = await prisma.novelLike.findUnique({
      where: {
        user_id_novel_id: {
          user_id: userId,
          novel_id: novelId,
        },
      },
    })

    if (existingLike) {
      // Unlike: Remove the like and decrement the counter
      await prisma.novelLike.delete({
        where: {
          user_id_novel_id: {
            user_id: userId,
            novel_id: novelId,
          },
        },
      })

      await prisma.novel.update({
        where: { novel_id: novelId },
        data: { likes: { decrement: 1 } },
      })

      return NextResponse.json({ action: "removed" })
    } else {
      // Like: Add the like and increment the counter
      await prisma.novelLike.create({
        data: {
          user_id: userId,
          novel_id: novelId,
        },
      })

      await prisma.novel.update({
        where: { novel_id: novelId },
        data: { likes: { increment: 1 } },
      })

      return NextResponse.json({ action: "added" })
    }
  } catch (error) {
    console.error("Error toggling like:", error)
    return NextResponse.json({ error: "Failed to toggle like" }, { status: 500 })
  }
}
