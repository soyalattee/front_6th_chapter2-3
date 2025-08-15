import { Button, HighlightText, useQueryParams } from "@/shared"
import { Comment } from "@/entities/comments/types"
import { Edit2, ThumbsUp, Trash2 } from "lucide-react"

interface CommentItemProps {
  comment: Comment
  postId: number
  likeCommentById: (id: number, postId: number) => void
  openEditCommentDialog: (comment: Comment) => void
  deleteCommentById: (id: number, postId: number) => void
}
export const CommentItem = ({
  comment,
  postId,
  likeCommentById,
  openEditCommentDialog,
  deleteCommentById,
}: CommentItemProps) => {
  const { searchQuery } = useQueryParams()

  return (
    <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
      <div className="flex items-center space-x-2 overflow-hidden">
        <span className="font-medium truncate">{comment.user.username}:</span>
        <span className="truncate">
          <HighlightText text={comment.body} highlight={searchQuery} />
        </span>
      </div>
      <div className="flex items-center space-x-1">
        <Button variant="ghost" size="sm" onClick={() => likeCommentById(comment.id, postId)}>
          <ThumbsUp className="w-3 h-3" />
          <span className="ml-1 text-xs">{comment.likes}</span>
        </Button>
        <Button variant="ghost" size="sm" onClick={() => openEditCommentDialog(comment)}>
          <Edit2 className="w-3 h-3" />
        </Button>
        <Button variant="ghost" size="sm" onClick={() => deleteCommentById(comment.id, postId)}>
          <Trash2 className="w-3 h-3" />
        </Button>
      </div>
    </div>
  )
}
