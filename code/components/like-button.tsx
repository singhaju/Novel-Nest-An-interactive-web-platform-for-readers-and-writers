"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Heart } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"

interface LikeButtonProps {
  novelId: number
  initialLiked: boolean
}

export function LikeButton({ novelId, initialLiked }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked)
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const handleLike = async () => {
    if (!session?.user) {
      router.push("/auth/login")
      return
    }

    setLoading(true)

    try {
      const res = await fetch("/api/likes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ novelId }),
      })

      if (res.ok) {
        const data = await res.json()
        setLiked(data.action === "added")
        router.refresh()
      }
    } catch (error) {
      console.error("Failed to toggle like:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleLike}
      disabled={loading}
      variant={liked ? "default" : "outline"}
      className="w-full rounded-2xl"
    >
      <Heart className={`mr-2 h-4 w-4 ${liked ? "fill-current" : ""}`} />
      {liked ? "Liked" : "Like"}
    </Button>
  )
}
