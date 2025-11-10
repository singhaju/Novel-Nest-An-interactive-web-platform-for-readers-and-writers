import { Header } from "@/components/header"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { redirect } from "next/navigation"
import { formatDistanceToNow } from "date-fns"
import Image from "next/image"
import type { Session } from "next-auth"


export default async function ProfilePage() {
  const session: Session | null = await getServerSession(authOptions)


  if (!session) {
    redirect("/auth/login")
  }

  const user = session.user

  const readingProgressRes = await fetch(`${process.env.NEXTAUTH_URL}/api/reading-progress?userId=${user.id}`, {
    cache: "no-store",
  })
  const readingProgress = readingProgressRes.ok ? await readingProgressRes.json() : []

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        <div className="grid gap-8 lg:grid-cols-[300px_1fr]">
          {/* Left Sidebar */}
          <div className="space-y-6">
            {/* Profile Picture */}
            <div className="relative aspect-square overflow-hidden rounded-full bg-gradient-to-br from-blue-100 to-green-100">
              {user.profile_picture ? (
                <Image
                  src={user.profile_picture || "/placeholder.svg"}
                  alt={user.username || "User"}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center p-4">
                    <p className="text-4xl font-bold text-foreground">Profile</p>
                    <p className="text-xl text-muted-foreground">Picture</p>
                  </div>
                </div>
              )}
            </div>

            {/* Badges */}
            <div className="rounded-2xl border border-border bg-card p-6">
              <h2 className="text-lg font-semibold mb-4">Badges</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 text-center text-sm text-muted-foreground py-4">No badges earned yet</div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="space-y-6">
            {/* Profile Info */}
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">{user.username}</h1>
              <p className="text-xl text-muted-foreground mb-4">{user.email}</p>

              <div className="rounded-3xl border border-border bg-card p-6">
                <h2 className="text-lg font-semibold mb-2">Bio</h2>
                <p className="text-muted-foreground leading-relaxed">{user.bio || "No bio added yet."}</p>
              </div>
            </div>

            {/* Reading History */}
            <div className="rounded-3xl border border-border bg-card p-6">
              <h2 className="text-xl font-semibold mb-4">Reading Progress</h2>
              <div className="space-y-3">
                {readingProgress && readingProgress.length > 0 ? (
                  readingProgress.map((progress: any) => (
                    <div
                      key={progress.id}
                      className="flex items-center justify-between rounded-2xl border border-border bg-background p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary text-primary-foreground">
                          <span className="text-sm font-bold">{progress.novel?.title?.[0] || "N"}</span>
                        </div>
                        <span className="font-medium">{progress.novel?.title}</span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {formatDistanceToNow(new Date(progress.updated_at), { addSuffix: true })}
                      </span>
                    </div>
                  ))
                ) : (
                  <p className="text-center text-muted-foreground py-4">No reading history yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
