import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "@/shared"

export interface PostEditData {
  id: number
  title: string
  body: string
  userId: number
  tags: string[]
  reactions: { likes: number; dislikes: number }
  views: number
}

interface EditPostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  post: PostEditData | null
  onPostChange: (post: PostEditData) => void
  onUpdatePost: () => void
  isLoading?: boolean
}

export const EditPostDialog = ({
  open,
  onOpenChange,
  post,
  onPostChange,
  onUpdatePost,
  isLoading = false,
}: EditPostDialogProps) => {
  if (!post) return null

  const isValid = post.title.trim() !== "" && post.body.trim() !== ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={post.title}
            onChange={(e) => onPostChange({ ...post, title: e.target.value })}
            disabled={isLoading}
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={post.body}
            onChange={(e) => onPostChange({ ...post, body: e.target.value })}
            disabled={isLoading}
          />
          <Button onClick={onUpdatePost} disabled={isLoading || !isValid}>
            {isLoading ? "업데이트 중..." : "게시물 업데이트"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
