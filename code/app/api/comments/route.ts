import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// GET /api/comments - Get comments for an episode
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const episodeId = searchParams.get("episodeId")

    if (!episodeId) {
      return NextResponse.json({ error: "Episode ID is required" }, { status: 400 })
    }

    const comments = await prisma.comment.findMany({
      where: {
        episode_id: Number.parseInt(episodeId),
        parent_comment_id: null, // Only top-level comments
      },
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
            profile_picture: true,
          },
        },
        replies: {
          include: {
            user: {
              select: {
                user_id: true,
                username: true,
                profile_picture: true,
              },
            },
          },
          orderBy: {
            created_at: "asc",
          },
        },
      },
      orderBy: {
        created_at: "desc",
      },
    })

    return NextResponse.json(comments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

// POST /api/comments - Create a comment
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { episodeId, content, parentCommentId } = body

    if (!episodeId || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const userId = Number.parseInt((session.user as any).id)

    const comment = await prisma.comment.create({
      data: {
        episode_id: episodeId,
        user_id: userId,
        content,
        parent_comment_id: parentCommentId || null,
      },
      include: {
        user: {
          select: {
            user_id: true,
            username: true,
            profile_picture: true,
          },
        },
      },
    })

    return NextResponse.json(comment, { status: 201 })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
}
