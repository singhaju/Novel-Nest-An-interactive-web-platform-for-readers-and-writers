import Link from "next/link"
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react"
import { Button } from "@/components/ui/button"
import type { Novel } from "@/lib/types/database"

interface HeroSectionProps {
  featured?: Novel
  stats: {
    novelCount: number
    writerCount: number
  }
  isAuthenticated: boolean
}

export function HeroSection({ featured, stats, isAuthenticated }: HeroSectionProps) {
  const headline = "Read. Write. Share."
  const subheading =
    "Follow immersive stories from emerging voices across every genre and publish your own adventures with a single click."

  const ratingFormatted = featured && typeof featured.rating === "number" ? featured.rating.toFixed(1) : "N/A"
  const viewsFormatted = featured && typeof featured.total_views === "number" ? featured.total_views.toLocaleString() : "0"
  const startReadingHref = isAuthenticated
    ? "/novels"
    : `/auth/login?callbackUrl=${encodeURIComponent("/novels")}`

  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-foreground/5 via-background to-background">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top,rgba(59,130,246,0.2),transparent_55%)]" />
      <div className="container mx-auto grid gap-12 px-4 py-16 md:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)] md:items-center">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full bg-muted px-4 py-1 text-sm text-muted-foreground">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>Discover original web novels updated daily</span>
          </div>

          <div className="space-y-5">
            <h1 className="text-balance text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
              {headline}
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">{subheading}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4">
            <Button asChild size="lg">
              <Link href={startReadingHref}>
                Start Reading
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button variant="outline" asChild size="lg">
              <Link href="/author">
                Become a Creator
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="flex flex-wrap items-center gap-8 text-sm">
            <div>
              <p className="text-2xl font-semibold text-foreground">{stats.novelCount}+ novels</p>
              <p className="text-muted-foreground">Curated series ready to binge</p>
            </div>
            <div>
              <p className="text-2xl font-semibold text-foreground">{stats.writerCount}+ writers</p>
              <p className="text-muted-foreground">Independent voices you can follow</p>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <ShieldCheck className="h-5 w-5 text-primary" />
              <span>Privacy-first, zero paywalls</span>
            </div>
          </div>
        </div>

        <div className="relative rounded-3xl border border-border bg-background/60 p-8 shadow-sm backdrop-blur">
          <div className="absolute inset-y-8 -left-12 hidden w-20 rounded-full bg-primary/20 blur-2xl md:block" />
          <div className="absolute -right-16 -top-10 hidden h-32 w-32 rounded-full bg-accent/30 blur-3xl md:block" />

          <div className="relative space-y-6">
            <p className="text-sm uppercase tracking-wide text-primary">Featured Story</p>
            {featured ? (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">{featured.title}</h2>
                <p className="line-clamp-4 text-sm text-muted-foreground">
                  {featured.summary || "A fresh story selected by our editors. Dive into a world loved by thousands of readers."}
                </p>
                <div className="flex items-center gap-6 text-xs text-muted-foreground">
                  <span>Rating: {ratingFormatted}</span>
                  <span>{viewsFormatted} reads</span>
                </div>
                <Button asChild variant="ghost">
                  <Link
                    href={
                      isAuthenticated
                        ? `/novel/${featured.id}`
                        : `/auth/login?callbackUrl=${encodeURIComponent(`/novel/${featured.id}`)}`
                    }
                  >
                    Continue reading
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                <h2 className="text-2xl font-semibold text-foreground">Build your shelf</h2>
                <p className="text-sm text-muted-foreground">
                  Your personal recommendations will appear here once you start following authors and bookmarking novels.
                </p>
                <Button asChild variant="ghost">
                  <Link href="/auth/login">
                    Sign in to personalise
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
