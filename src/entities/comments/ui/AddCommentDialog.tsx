import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Textarea } from "@/shared"
import { addComment, AddCommentRequest, Comment } from "../api/commentsApis"
import { useState } from "react"

interface AddCommentDialogProps {
  showAddCommentDialog: boolean
  setShowAddCommentDialog: (show: boolean) => void
  setComments: React.Dispatch<React.SetStateAction<Record<number, Comment[]>>>
  postId: number
}
export const AddCommentDialog = ({
  showAddCommentDialog,
  setShowAddCommentDialog,
  setComments,
  postId,
}: AddCommentDialogProps) => {
  const [newComment, setNewComment] = useState<AddCommentRequest>({ body: "", postId, userId: 1 })

  // 댓글 추가
  const handleAddComment = async () => {
    // 댓글 내용이 비어있으면 추가하지 않음
    if (newComment.body.trim() === "") {
      alert("댓글 내용을 입력해주세요.")
      return
    }

    try {
      const response = await addComment(newComment)

      setComments((prev) => ({
        ...prev,
        [response.postId]: [...(prev[response.postId] || []), { ...response, likes: 0 }],
      }))
      setShowAddCommentDialog(false)
      setNewComment({ body: "", postId, userId: 1 })
    } catch (error) {
      console.error("댓글 추가 오류:", error)
    }
  }

  return (
    <Dialog open={showAddCommentDialog} onOpenChange={setShowAddCommentDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea
            placeholder="댓글 내용"
            value={newComment.body}
            onChange={(e) => setNewComment({ ...newComment, body: e.target.value })}
          />
          <Button onClick={handleAddComment}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
