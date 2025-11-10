"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "./ui/button"
import { Textarea } from "./ui/textarea"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { apiClient } from "@/lib/api-client"

interface CommentFormProps {
  episodeId: number
  parentCommentId?: number
}

export function CommentForm({ episodeId, parentCommentId }: CommentFormProps) {
  const [content, setContent] = useState("")
  const [loading, setLoading] = useState(false)
  const { data: session } = useSession()
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!content.trim()) return

    if (!session?.user) {
      router.push("/auth/login")
      return
    }

    setLoading(true)

    try {
      await apiClient.createComment({
        episodeId,
        content: content.trim(),
        parentCommentId,
      })

      setContent("")
      router.refresh()
    } catch (error) {
      console.error("Failed to post comment:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <Textarea
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Write a comment..."
        className="min-h-[100px] rounded-2xl"
      />
      <Button type="submit" disabled={loading || !content.trim()} className="rounded-2xl">
        Post Comment
      </Button>
    </form>
  )
}
