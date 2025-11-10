import { type NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/prisma"
import { getFileFromGoogleDrive } from "@/lib/google-drive"

// GET /api/episodes/[id] - Get episode with content
export async function GET(request: NextRequest, context: any) {
  const rawParams = context?.params instanceof Promise ? await context.params : context?.params;
  try {
    const episodeId = Number.parseInt(rawParams?.id)

    const episode = await prisma.episode.findUnique({
      where: { episode_id: episodeId },
      include: {
        novel: {
          select: {
            novel_id: true,
            title: true,
            author_id: true,
          },
        },
      },
    })

    if (!episode) {
      return NextResponse.json({ error: "Episode not found" }, { status: 404 })
    }

    // Fetch content from Google Drive
    const content = await getFileFromGoogleDrive(episode.content)

    return NextResponse.json({
      ...episode,
      contentText: content,
    })
  } catch (error) {
    console.error("Error fetching episode:", error)
    return NextResponse.json({ error: "Failed to fetch episode" }, { status: 500 })
  }
}
