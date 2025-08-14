import { useState, useCallback } from "react"
import {
  Comment,
  deleteComment,
  getCommentsByPostId,
  likeComment,
  updateComment,
  addComment,
  AddCommentRequest,
} from "../api/commentsApis"

export const useCommentActions = () => {
  const [comments, setComments] = useState<Record<number, Comment[]>>({})
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)

  // 댓글 가져오기
  const fetchComments = useCallback(
    async (postId: number) => {
      if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음
      try {
        const response = await getCommentsByPostId(postId)
        setComments((prev) => ({ ...prev, [postId]: response.comments }))
      } catch (error) {
        console.error("댓글 가져오기 오류:", error)
      }
    },
    [comments],
  )

  // 댓글 삭제
  const deleteCommentById = async (id: number, postId: number) => {
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
  const likeCommentById = async (id: number, postId: number) => {
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

  // 댓글 수정
  const updateCommentById = async (commentId: number, body: string) => {
    try {
      const response = await updateComment(commentId, { body })
      setComments((prev) => ({
        ...prev,
        [response.postId]: prev[response.postId].map((comment) => (comment.id === response.id ? response : comment)),
      }))
      return response
    } catch (error) {
      console.error("댓글 업데이트 오류:", error)
      throw error
    }
  }

  // 댓글 추가
  const addCommentToPost = async (commentData: AddCommentRequest) => {
    try {
      const response = await addComment(commentData)
      setComments((prev) => ({
        ...prev,
        [response.postId]: [...(prev[response.postId] || []), { ...response, likes: 0 }],
      }))
      return response
    } catch (error) {
      console.error("댓글 추가 오류:", error)
      throw error
    }
  }

  // 선택된 댓글 업데이트 (로컬 상태만)
  const updateSelectedComment = (updatedComment: Comment) => {
    setSelectedComment(updatedComment)
  }

  return {
    comments,
    selectedComment,
    setSelectedComment,
    fetchComments,
    deleteCommentById,
    likeCommentById,
    updateCommentById,
    addCommentToPost,
    updateSelectedComment,
  }
}
