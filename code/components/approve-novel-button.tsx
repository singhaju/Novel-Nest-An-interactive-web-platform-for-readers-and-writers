"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { useRouter } from "next/navigation"
import { Check, X } from "lucide-react"

interface ApproveNovelButtonProps {
  novelId: string
}

export function ApproveNovelButton({ novelId }: ApproveNovelButtonProps) {
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  const handleApprove = async () => {
    setLoading(true)
    await fetch(`/api/novels/${novelId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "Ongoing" }),
    })

    setLoading(false)
    router.refresh()
  }

  const handleReject = async () => {
    setLoading(true)
    await fetch(`/api/novels/${novelId}`, {
      method: "DELETE",
    })

    setLoading(false)
    router.refresh()
  }

  return (
    <div className="flex gap-2">
      <Button onClick={handleApprove} disabled={loading} size="sm" className="rounded-full">
        <Check className="mr-1 h-4 w-4" />
        Approve
      </Button>
      <Button onClick={handleReject} disabled={loading} variant="destructive" size="sm" className="rounded-full">
        <X className="mr-1 h-4 w-4" />
        Reject
      </Button>
    </div>
  )
}
