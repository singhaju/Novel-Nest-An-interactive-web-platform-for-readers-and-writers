import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("q")

    if (!query || query.trim().length === 0) {
      return NextResponse.json({ results: [] })
    }

    // Search novels by title, author username, or tags
    const novels = await prisma.novel.findMany({
      where: {
        OR: [
          {
            title: {
              contains: query,
            },
          },
          {
            author: {
              username: {
                contains: query,
              },
            },
          },
          {
            tags: {
              contains: query,
            },
          },
        ],
        status: {
          not: "PENDING_APPROVAL",
        },
      },
      include: {
        author: {
          select: {
            username: true,
          },
        },
      },
      take: 10, // Limit to 10 results for dropdown
      orderBy: {
        created_at: "desc",
      },
    })

    return NextResponse.json({ results: novels })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json(
      { error: "Failed to search novels" },
      { status: 500 }
    )
  }
}
