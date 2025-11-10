import { type NextRequest, NextResponse } from "next/server"
import { auth } from "@/lib/auth"
import { prisma } from "@/lib/prisma"

// POST /api/reviews - Create a review
export async function POST(request: NextRequest) {
  try {
    const session = await auth()

    if (!session?.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await request.json()
    const { novelId, rating, comment } = body

    if (!novelId || !rating) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (rating < 1 || rating > 5) {
      return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 })
    }

    const userId = Number.parseInt((session.user as any).id)

    const review = await prisma.review.create({
      data: {
        novel_id: novelId,
        user_id: userId,
        rating,
        comment,
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

    // Update novel average rating
    const reviews = await prisma.review.findMany({
      where: { novel_id: novelId },
      select: { rating: true },
    })

    const avgRating = reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length

    await prisma.novel.update({
      where: { novel_id: novelId },
      data: { rating: avgRating },
    })

    return NextResponse.json(review, { status: 201 })
  } catch (error) {
    console.error("Error creating review:", error)
    return NextResponse.json({ error: "Failed to create review" }, { status: 500 })
  }
}
