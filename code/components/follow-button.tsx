"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { UserPlus } from "lucide-react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"

interface FollowButtonProps {
  authorId: number
  initialFollowing?: boolean
}

export function FollowButton({ authorId, initialFollowing = false }: FollowButtonProps) {
  const [following, setFollowing] = useState(initialFollowing)
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  useEffect(() => {
    // Check initial following status using API client
    const checkFollowingStatus = async () => {
      if (!session?.user) return

      try {
        const result = await apiClient.checkFollow(authorId)
        setFollowing(result.isFollowing)
      } catch (error) {
        console.error("Failed to check follow status:", error)
      }
    }

    checkFollowingStatus()
  }, [session])

  const handleFollow = async () => {
    if (!session?.user) {
      router.push("/auth/login")
      return
    }

    setLoading(true)

    try {
      const result = await apiClient.toggleFollow(authorId)
      setFollowing(result.action === "followed")
      router.refresh()
    } catch (error) {
      console.error("Failed to toggle follow:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Button
      onClick={handleFollow}
      disabled={loading}
      variant={following ? "default" : "outline"}
      className="w-full rounded-2xl"
    >
      <UserPlus className="mr-2 h-4 w-4" />
      {following ? "Following" : "Follow Author"}
    </Button>
  )
}
