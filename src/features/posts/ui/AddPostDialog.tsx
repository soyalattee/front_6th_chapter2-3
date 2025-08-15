import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "@/shared"
import { CreatePostData } from "@/features/posts/types"

interface AddPostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  postData: CreatePostData
  onPostDataChange: (data: CreatePostData) => void
  onAddPost: () => void
  isLoading?: boolean
}

export const AddPostDialog = ({
  open,
  onOpenChange,
  postData,
  onPostDataChange,
  onAddPost,
  isLoading = false,
}: AddPostDialogProps) => {
  const isValid = postData.title.trim() !== "" && postData.body.trim() !== ""

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={postData.title}
            onChange={(e) => onPostDataChange({ ...postData, title: e.target.value })}
            disabled={isLoading}
          />
          <Textarea
            rows={30}
            placeholder="내용"
            value={postData.body}
            onChange={(e) => onPostDataChange({ ...postData, body: e.target.value })}
            disabled={isLoading}
          />
          <Input
            type="number"
            placeholder="사용자 ID"
            value={postData.userId}
            onChange={(e) => onPostDataChange({ ...postData, userId: Number(e.target.value) })}
            disabled={isLoading}
          />
          <Button onClick={onAddPost} disabled={isLoading || !isValid}>
            {isLoading ? "추가 중..." : "게시물 추가"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
