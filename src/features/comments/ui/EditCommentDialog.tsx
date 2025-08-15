import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "@/shared"
import { Comment } from "@/entities/comments"

interface EditCommentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  comment: Comment | null
  onCommentChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  onUpdateComment: () => void
  isLoading?: boolean
}

export const EditCommentDialog = ({
  open,
  onOpenChange,
  comment,
  onCommentChange,
  onUpdateComment,
  isLoading = false,
}: EditCommentDialogProps) => {
  if (!comment) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea placeholder="댓글 내용" value={comment.body} onChange={onCommentChange} disabled={isLoading} />
          <Button onClick={onUpdateComment} disabled={isLoading}>
            {isLoading ? "업데이트 중..." : "댓글 업데이트"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
