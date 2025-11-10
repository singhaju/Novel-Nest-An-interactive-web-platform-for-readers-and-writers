import { getCurrentUser } from "@/lib/actions/auth"
import { CommentForm } from "./comment-form"
import { formatDistanceToNow } from "date-fns"
import { apiClient } from "@/lib/api-client"

interface CommentSectionProps {
  episodeId: number
}

export async function CommentSection({ episodeId }: CommentSectionProps) {
  const user = await getCurrentUser()

  const comments = await apiClient.getComments(episodeId)

  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <h2 className="text-xl font-semibold mb-4">Comment ({comments?.length || 0})</h2>

      {user && <CommentForm episodeId={episodeId} />}

      <div className="mt-6 space-y-4">
        {comments?.map((comment: any) => (
          <div key={comment.comment_id} className="flex gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
              {comment.user.username[0].toUpperCase()}
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <span className="font-semibold">{comment.user.username}</span>
                <span className="text-sm text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.created_at), { addSuffix: true })}
                </span>
              </div>
              <p className="text-muted-foreground">{comment.content}</p>

              {/* Render replies if any */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="mt-4 ml-8 space-y-3">
                  {comment.replies.map((reply: any) => (
                    <div key={reply.comment_id} className="flex gap-3">
                      <div className="flex h-8 w-8 items-center justify-center rounded-full bg-secondary text-secondary-foreground text-sm">
                        {reply.user.username[0].toUpperCase()}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-medium text-sm">{reply.user.username}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(reply.created_at), { addSuffix: true })}
                          </span>
                        </div>
                        <p className="text-sm text-muted-foreground">{reply.content}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
