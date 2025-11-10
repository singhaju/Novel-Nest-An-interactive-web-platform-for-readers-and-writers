import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"
import { uploadToGoogleDrive } from "@/lib/google-drive"

// POST /api/episodes - Create a new episode
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const formData = await request.formData()
    const novelId = Number.parseInt(formData.get("novelId") as string)
    const title = formData.get("title") as string
    const content = formData.get("content") as string

    if (!novelId || !title || !content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Verify user is the author
    const novel = await prisma.novel.findUnique({
      where: { novel_id: novelId },
    })

    if (!novel) {
      return NextResponse.json({ error: "Novel not found" }, { status: 404 })
    }

    const userId = Number.parseInt((session.user as any).id)
    if (novel.author_id !== userId) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    // Upload content to Google Drive
    const contentUrl = await uploadToGoogleDrive({
      fileName: `episode_${novelId}_${Date.now()}.txt`,
      mimeType: "text/plain",
      fileContent: content,
      folderId: process.env.GOOGLE_DRIVE_EPISODES_FOLDER_ID,
    })

    const episode = await prisma.episode.create({
      data: {
        novel_id: novelId,
        title,
        content: contentUrl,
      },
    })

    return NextResponse.json(episode, { status: 201 })
  } catch (error) {
    console.error("Error creating episode:", error)
    return NextResponse.json({ error: "Failed to create episode" }, { status: 500 })
  }
}
