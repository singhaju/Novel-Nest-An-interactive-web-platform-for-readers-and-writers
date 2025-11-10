import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST /api/follows - Toggle follow
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { authorId } = body

    if (!authorId) {
      return NextResponse.json({ error: "Author ID is required" }, { status: 400 })
    }

    const userId = Number.parseInt((session.user as any).id)

    if (userId === authorId) {
      return NextResponse.json({ error: "Cannot follow yourself" }, { status: 400 })
    }

    // Check if already following
    const existing = await prisma.userFollow.findUnique({
      where: {
        follower_id_following_id: {
          follower_id: userId,
          following_id: authorId,
        },
      },
    })

    if (existing) {
      // Unfollow
      await prisma.userFollow.delete({
        where: {
          follower_id_following_id: {
            follower_id: userId,
            following_id: authorId,
          },
        },
      })

      return NextResponse.json({ action: "unfollowed" })
    } else {
      // Follow
      await prisma.userFollow.create({
        data: {
          follower_id: userId,
          following_id: authorId,
        },
      })

      return NextResponse.json({ action: "followed" })
    }
  } catch (error) {
    console.error("Error toggling follow:", error)
    return NextResponse.json({ error: "Failed to toggle follow" }, { status: 500 })
  }
}
