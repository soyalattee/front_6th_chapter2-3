import { Button } from "@/shared"
import { Plus } from "lucide-react"
import { useEffect, useState } from "react"
import { Comment } from "../api/commentsApis"
import { useCommentActions } from "../hooks/useCommentActions"
import { AddCommentDialog } from "./AddCommentDialog"
import { EditCommentDialog } from "./EditCommentDialog"
import { CommentItem } from "./CommentItem"

interface CommentsProps {
  postId: number
}

// 댓글 렌더링
export const Comments = ({ postId }: CommentsProps) => {
  const {
    comments,
    selectedComment,
    setSelectedComment,
    fetchComments,
    deleteCommentById,
    likeCommentById,
    updateCommentById,
    addCommentToPost,
    updateSelectedComment,
  } = useCommentActions()

  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)
  const [isAdding, setIsAdding] = useState(false)
  const [newCommentBody, setNewCommentBody] = useState("")

  // 댓글 내용 변경 핸들러
  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!selectedComment) return
    updateSelectedComment({ ...selectedComment, body: e.target.value })
  }

  // 댓글 업데이트 핸들러
  const handleUpdateComment = async () => {
    if (!selectedComment) return
    setIsUpdating(true)
    try {
      await updateCommentById(selectedComment.id, selectedComment.body)
      setShowEditCommentDialog(false)
    } finally {
      setIsUpdating(false)
    }
  }

  // 댓글 추가 핸들러
  const handleAddComment = async () => {
    if (newCommentBody.trim() === "") {
      alert("댓글 내용을 입력해주세요.")
      return
    }

    setIsAdding(true)
    try {
      await addCommentToPost({ body: newCommentBody, postId, userId: 1 })
      setShowAddCommentDialog(false)
      setNewCommentBody("")
    } finally {
      setIsAdding(false)
    }
  }

  const openAddCommentDialog = () => {
    setShowAddCommentDialog(true)
  }

  const openEditCommentDialog = (comment: Comment) => {
    setSelectedComment(comment)
    setShowEditCommentDialog(true)
  }

  useEffect(() => {
    fetchComments(postId)
  }, [postId, fetchComments])

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
        <div className="space-y-1">
          {comments[postId]?.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              postId={postId}
              likeCommentById={likeCommentById}
              openEditCommentDialog={openEditCommentDialog}
              deleteCommentById={deleteCommentById}
            />
          ))}
        </div>
      </div>

      {/* 댓글 추가 대화상자 */}
      <AddCommentDialog
        open={showAddCommentDialog}
        onOpenChange={setShowAddCommentDialog}
        commentBody={newCommentBody}
        onCommentBodyChange={setNewCommentBody}
        onAddComment={handleAddComment}
        isLoading={isAdding}
      />

      {/* 댓글 수정 대화상자 */}
      <EditCommentDialog
        open={showEditCommentDialog}
        onOpenChange={setShowEditCommentDialog}
        comment={selectedComment}
        onCommentChange={handleCommentChange}
        onUpdateComment={handleUpdateComment}
        isLoading={isUpdating}
      />
    </>
  )
}
