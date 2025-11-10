import { Header } from "@/components/header"
import { NovelGrid } from "@/components/novel-grid"
import { Button } from "@/components/ui/button"
import { apiClient } from "@/lib/api-client"
import Link from "next/link"

export default async function HomePage() {
  const { novels: recommendedNovels } = await apiClient.getNovels({
    status: "ONGOING",
    limit: 12,
  })

  const { novels: fantasyNovels } = await apiClient.getNovels({
    genre: "Fantasy",
    limit: 12,
  })

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <section className="mb-12 rounded-3xl bg-muted p-12">
          <h1 className="mb-4 text-4xl font-bold text-foreground text-balance">Discover Your Next Favorite Story</h1>
          <Link href="/novels">
            <Button className="rounded-full bg-foreground px-8 py-6 text-background hover:bg-foreground/90">
              Browse All Novels
            </Button>
          </Link>
        </section>

        {/* Recommended Section */}
        <section className="mb-12">
          <h2 className="mb-6 text-2xl font-bold text-foreground">Recommended</h2>
          <NovelGrid novels={recommendedNovels || []} />
        </section>

        {/* Fantasy Section */}
        <section>
          <h2 className="mb-6 text-2xl font-bold text-foreground">Fantasy</h2>
          <NovelGrid novels={fantasyNovels || []} />
        </section>
      </main>
    </div>
  )
}
