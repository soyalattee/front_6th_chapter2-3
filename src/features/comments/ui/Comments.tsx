import { Button } from "@/shared"
import { Plus } from "lucide-react"
import { useState } from "react"
import { Comment } from "@/entities/comments"
import { useCommentActions } from "@/features/comments/hooks/useCommentActions"
import { AddCommentDialog } from "@/features/comments/ui/AddCommentDialog"
import { EditCommentDialog } from "@/features/comments/ui/EditCommentDialog"
import { CommentItem } from "@/entities/comments/ui/CommentItem"

interface CommentsProps {
  postId: number
}

// 댓글 렌더링
export const Comments = ({ postId }: CommentsProps) => {
  const {
    comments,
    selectedComment,
    setSelectedComment,
    loading,
    error,
    deleteCommentById,
    likeCommentById,
    updateCommentById,
    addCommentToPost,
    updateSelectedComment,
    isAddingComment,
    isUpdatingComment,
  } = useCommentActions(postId) // postId를 인자로 전달

  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)
  const [newCommentBody, setNewCommentBody] = useState("")

  // 댓글 내용 변경 핸들러
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!selectedComment) return
    updateSelectedComment({ ...selectedComment, body: e.target.value })
  }

  // 댓글 업데이트 핸들러
  const handleUpdateComment = async () => {
    if (!selectedComment) return
    try {
      await updateCommentById(selectedComment.id, selectedComment.body)
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error("댓글 업데이트 실패:", error)
    }
  }

  // 댓글 추가 핸들러
  const handleAddComment = async () => {
    if (newCommentBody.trim() === "") {
      alert("댓글 내용을 입력해주세요.")
      return
    }

    try {
      await addCommentToPost({ body: newCommentBody, postId, userId: 1 })
      setShowAddCommentDialog(false)
      setNewCommentBody("")
    } catch (error) {
      console.error("댓글 추가 실패:", error)
    }
  }

  // 댓글 좋아요
  const handleLikeComment = async (id: number) => {
    try {
      await likeCommentById(id)
    } catch (error) {
      console.error("댓글 좋아요 실패:", error)
    }
  }

  // 댓글 삭제
  const handleDeleteComment = async (id: number) => {
    try {
      await deleteCommentById(id)
    } catch (error) {
      console.error("댓글 삭제 실패:", error)
    }
  }

  // 댓글 추가 모달 열기
  const openAddCommentDialog = () => {
    setShowAddCommentDialog(true)
  }

  // 댓글 수정 모달 열기
  const openEditCommentDialog = (comment: Comment) => {
    setSelectedComment(comment)
    setShowEditCommentDialog(true)
  }

  return (
    <>
      <div className="mt-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">댓글</h3>
          <Button size="sm" onClick={openAddCommentDialog}>
            <Plus className="w-3 h-3 mr-1" />
            댓글 추가
          </Button>
        </div>
        {error && <div className="text-red-500">{error.message}</div>}
        <div className="space-y-1">
          {loading && <div className="text-center text-sm text-gray-500">댓글을 불러오는 중...</div>}
          {comments &&
            comments.map((comment) => (
              <CommentItem
                key={comment.id}
                comment={comment}
                postId={postId}
                likeCommentById={handleLikeComment}
                openEditCommentDialog={openEditCommentDialog}
                deleteCommentById={handleDeleteComment}
              />
            ))}
        </div>
      </div>

      {/* 댓글 추가 모달 */}
      <AddCommentDialog
        open={showAddCommentDialog}
        onOpenChange={setShowAddCommentDialog}
        commentBody={newCommentBody}
        onCommentBodyChange={setNewCommentBody}
        onAddComment={handleAddComment}
        isLoading={isAddingComment}
      />

      {/* 댓글 수정 모달 */}
      <EditCommentDialog
        open={showEditCommentDialog}
        onOpenChange={setShowEditCommentDialog}
        comment={selectedComment}
        onCommentChange={handleCommentChange}
        onUpdateComment={handleUpdateComment}
        isLoading={isUpdatingComment}
      />
    </>
  )
}
