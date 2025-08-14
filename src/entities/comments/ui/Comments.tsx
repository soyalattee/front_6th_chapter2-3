import { Button, HighlightText, useQueryParams } from "@/shared"
import { Plus, ThumbsUp, Edit2, Trash2 } from "lucide-react"
import { useEffect, useState } from "react"
import { Comment, deleteComment, getCommentsByPostId, likeComment, updateComment } from "../api/commentsApis"
import { AddCommentDialog } from "./AddCommentDialog"
import { EditCommentDialog } from "./EditCommentDialog"

interface CommentsProps {
  postId: number
}

// 댓글 렌더링
export const Comments = ({ postId }: CommentsProps) => {
  const { searchQuery } = useQueryParams()
  const [comments, setComments] = useState<Record<number, Comment[]>>({})
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)
  const [showAddCommentDialog, setShowAddCommentDialog] = useState(false)
  const [showEditCommentDialog, setShowEditCommentDialog] = useState(false)

  // 댓글 가져오기
  const fetchComments = async (postId: number) => {
    if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const response = await getCommentsByPostId(postId)
      setComments((prev) => ({ ...prev, [postId]: response.comments }))
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  }

  // 댓글 업데이트
  const handleUpdateComment = async () => {
    try {
      if (!selectedComment) return
      const response = await updateComment(selectedComment.id, { body: selectedComment.body })
      setComments((prev) => ({
        ...prev,
        [response.postId]: prev[response.postId].map((comment) => (comment.id === response.id ? response : comment)),
      }))
      setShowEditCommentDialog(false)
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
    }
  }

  // 댓글 삭제
  const handleDeleteComment = async (id: number, postId: number) => {
    try {
      await deleteComment(id)
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].filter((comment) => comment.id !== id),
      }))
    } catch (error) {
      console.error("댓글 삭제 오류:", error)
    }
  }

  // 댓글 좋아요
  const handleLikeComment = async (id: number, postId: number) => {
    const comment = comments[postId]?.find((c) => c.id === id)
    if (!comment) return
    try {
      const response = await likeComment(id, { likes: comment.likes + 1 })
      setComments((prev) => ({
        ...prev,
        [postId]: prev[postId].map((comment) =>
          comment.id === response.id ? { ...response, likes: comment.likes + 1 } : comment,
        ),
      }))
    } catch (error) {
      console.error("댓글 좋아요 오류:", error)
    }
  }

  const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    if (!selectedComment) return
    setSelectedComment({ ...selectedComment, body: e.target.value })
  }

  useEffect(() => {
    fetchComments(postId)
  }, [postId])

  return (
    <>
      <div className="mt-2">
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-sm font-semibold">댓글</h3>
          <Button
            size="sm"
            onClick={() => {
              setShowAddCommentDialog(true)
            }}
          >
            <Plus className="w-3 h-3 mr-1" />
            댓글 추가
          </Button>
        </div>
        <div className="space-y-1">
          {comments[postId]?.map((comment) => (
            <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
              <div className="flex items-center space-x-2 overflow-hidden">
                <span className="font-medium truncate">{comment.user.username}:</span>
                <span className="truncate">
                  <HighlightText text={comment.body} highlight={searchQuery} />
                </span>
              </div>
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="sm" onClick={() => handleLikeComment(comment.id, postId)}>
                  <ThumbsUp className="w-3 h-3" />
                  <span className="ml-1 text-xs">{comment.likes}</span>
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setSelectedComment(comment)
                    setShowEditCommentDialog(true)
                  }}
                >
                  <Edit2 className="w-3 h-3" />
                </Button>
                <Button variant="ghost" size="sm" onClick={() => handleDeleteComment(comment.id, postId)}>
                  <Trash2 className="w-3 h-3" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 댓글 추가 대화상자 */}
      <AddCommentDialog
        showAddCommentDialog={showAddCommentDialog}
        setShowAddCommentDialog={setShowAddCommentDialog}
        setComments={setComments}
        postId={postId}
      />

      {/* 댓글 수정 대화상자 */}
      {selectedComment && (
        <EditCommentDialog
          showEditCommentDialog={showEditCommentDialog}
          setShowEditCommentDialog={setShowEditCommentDialog}
          selectedComment={selectedComment}
          handleCommentChange={handleCommentChange}
          handleUpdateComment={handleUpdateComment}
        />
      )}
    </>
  )
}
