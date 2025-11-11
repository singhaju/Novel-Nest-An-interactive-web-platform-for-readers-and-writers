import { Header } from "@/components/header"
import { NovelGrid } from "@/components/novel-grid"
import { prisma } from "@/lib/prisma"
import type { Novel } from "@/lib/types/database"

interface NovelsPageProps {
  searchParams: Promise<{
    search?: string
  }>
}

export default async function NovelsPage({ searchParams }: NovelsPageProps) {
  const params = await searchParams
  const searchQuery = params.search

  // If there's a search query, search novels; otherwise show all
  const novelsData = await prisma.novel.findMany({
    where: searchQuery
      ? {
          OR: [
            {
              title: {
                contains: searchQuery,
              },
            },
            {
              author: {
                username: {
                  contains: searchQuery,
                },
              },
            },
            {
              tags: {
                contains: searchQuery,
              },
            },
          ],
          status: {
            not: "PENDING_APPROVAL",
          },
        }
      : {
          status: {
            in: ["ONGOING", "COMPLETED"],
          },
        },
    include: {
      author: {
        select: {
          username: true,
        },
      },
    },
    orderBy: {
      created_at: "desc",
    },
  })

  // Map Prisma data to expected Novel type
  const novels = novelsData.map((novel) => ({
    id: String(novel.novel_id),
    title: novel.title,
    author_id: String(novel.author_id),
    summary: novel.description || undefined,
    cover_url: novel.cover_image || undefined,
    status: novel.status.toLowerCase() as Novel["status"],
    total_views: novel.views,
    total_likes: novel.likes,
    rating: Number(novel.rating),
    genre: novel.tags || undefined,
    created_at: novel.created_at.toISOString(),
    updated_at: novel.last_update.toISOString(),
    author: {
      username: novel.author.username,
    },
  })) as any

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <h1 className="mb-2 text-3xl font-bold text-foreground">
          {searchQuery ? `Search Results for "${searchQuery}"` : "All Novels"}
        </h1>
        {searchQuery && (
          <p className="mb-8 text-muted-foreground">
            Found {novels.length} novel{novels.length !== 1 ? "s" : ""}
          </p>
        )}
        <NovelGrid novels={novels} />
      </main>
    </div>
  )
}
