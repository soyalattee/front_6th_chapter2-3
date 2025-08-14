import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "@/shared"

interface AddCommentDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  commentBody: string
  onCommentBodyChange: (body: string) => void
  onAddComment: () => void
  isLoading?: boolean
}

export const AddCommentDialog = ({
  open,
  onOpenChange,
  commentBody,
  onCommentBodyChange,
  onAddComment,
  isLoading = false,
}: AddCommentDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={commentBody}
            onChange={(e) => onCommentBodyChange(e.target.value)}
            disabled={isLoading}
          />
          <Button onClick={onAddComment} disabled={isLoading || commentBody.trim() === ""}>
            {isLoading ? "추가 중..." : "댓글 추가"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
