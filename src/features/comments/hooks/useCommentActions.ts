import { useState } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import {
  Comment,
  deleteComment,
  getCommentsByPostId,
  likeComment,
  updateComment,
  addComment,
  AddCommentRequest,
} from "@/entities/comments"
import { QUERY_KEYS } from "@/shared"

export const useCommentActions = (postId: number) => {
  const queryClient = useQueryClient()
  const [selectedComment, setSelectedComment] = useState<Comment | null>(null)

  // 전역 댓글 저장소 가져오기
  const { data: commentsStore = {}, isLoading: storeLoading } = useQuery({
    queryKey: QUERY_KEYS.COMMENTS.store,
    queryFn: () => Promise.resolve({} as Record<number, Comment[]>), // 초기값
    staleTime: Infinity, // 영구 저장
    gcTime: Infinity, // 메모리에서 제거하지 않음
  })

  // 현재 게시물의 댓글들
  const comments = commentsStore[postId] || []
  const hasComments = !!commentsStore[postId]

  // 댓글이 없을 때만 서버에서 가져오기
  const { isLoading: fetchLoading, error } = useQuery({
    queryKey: QUERY_KEYS.COMMENTS.byPost(postId),
    queryFn: async () => {
      const response = await getCommentsByPostId(postId)
      // 가져온 댓글을 전역 저장소에 저장
      queryClient.setQueryData<Record<number, Comment[]>>(QUERY_KEYS.COMMENTS.store, (prevStore) => ({
        ...prevStore,
        [postId]: response.comments,
      }))
      return response.comments
    },
    enabled: !!postId && !hasComments, // 댓글이 없을 때만 실행
  })

  const loading = storeLoading || fetchLoading

  // 댓글 삭제 Mutation
  const deleteCommentMutation = useMutation({
    mutationFn: (commentId: number) => deleteComment(commentId),
    onSuccess: (_, commentId) => {
      // 전역 저장소에서 댓글 삭제
      queryClient.setQueryData<Record<number, Comment[]>>(QUERY_KEYS.COMMENTS.store, (prevStore) => ({
        ...prevStore,
        [postId]: prevStore?.[postId]?.filter((comment) => comment.id !== commentId) || [],
      }))
    },
  })

  // 댓글 좋아요 Mutation
  const likeCommentMutation = useMutation({
    mutationFn: ({ commentId, likes }: { commentId: number; likes: number }) => likeComment(commentId, { likes }),
    onSuccess: (updatedComment) => {
      // 전역 저장소에서 댓글 좋아요 업데이트
      queryClient.setQueryData<Record<number, Comment[]>>(QUERY_KEYS.COMMENTS.store, (prevStore) => ({
        ...prevStore,
        [postId]:
          prevStore?.[postId]?.map((comment) =>
            comment.id === updatedComment.id ? { ...updatedComment, likes: updatedComment.likes + 1 } : comment,
          ) || [],
      }))
    },
  })

  // 댓글 수정 Mutation
  const updateCommentMutation = useMutation({
    mutationFn: ({ commentId, body }: { commentId: number; body: string }) => updateComment(commentId, { body }),
    onSuccess: (updatedComment) => {
      // 전역 저장소에서 댓글 수정
      queryClient.setQueryData<Record<number, Comment[]>>(QUERY_KEYS.COMMENTS.store, (prevStore) => ({
        ...prevStore,
        [postId]:
          prevStore?.[postId]?.map((comment) => (comment.id === updatedComment.id ? updatedComment : comment)) || [],
      }))
      // 선택된 댓글도 업데이트
      if (selectedComment?.id === updatedComment.id) {
        setSelectedComment(updatedComment)
      }
    },
  })

  // 댓글 추가 Mutation
  const addCommentMutation = useMutation({
    mutationFn: addComment,
    onSuccess: (newComment) => {
      // 전역 저장소에 댓글 추가
      queryClient.setQueryData<Record<number, Comment[]>>(QUERY_KEYS.COMMENTS.store, (prevStore) => ({
        ...prevStore,
        [postId]: [...(prevStore?.[postId] || []), { ...newComment, likes: 0 }],
      }))
    },
  })

  // 댓글 삭제
  const deleteCommentById = async (id: number) => {
    return deleteCommentMutation.mutateAsync(id)
  }

  // 댓글 좋아요
  const likeCommentById = async (id: number) => {
    const comment = comments?.find((c) => c.id === id)
    if (!comment) return
    return likeCommentMutation.mutateAsync({ commentId: id, likes: comment.likes + 1 })
  }

  // 댓글 수정
  const updateCommentById = async (commentId: number, body: string) => {
    return updateCommentMutation.mutateAsync({ commentId, body })
  }

  // 댓글 추가
  const addCommentToPost = async (commentData: AddCommentRequest) => {
    return addCommentMutation.mutateAsync(commentData)
  }

  // 선택된 댓글 업데이트 (로컬 상태만)
  const updateSelectedComment = (updatedComment: Comment) => {
    setSelectedComment(updatedComment)
  }

  // 댓글 새로고침
  const fetchComments = async () => {
    const response = await getCommentsByPostId(postId)
    queryClient.setQueryData<Record<number, Comment[]>>(QUERY_KEYS.COMMENTS.store, (prevStore) => ({
      ...prevStore,
      [postId]: response.comments,
    }))
  }

  return {
    comments,
    selectedComment,
    setSelectedComment,
    loading,
    error,
    fetchComments,
    deleteCommentById,
    likeCommentById,
    updateCommentById,
    addCommentToPost,
    updateSelectedComment,
    // Mutation loading states
    isAddingComment: addCommentMutation.isPending,
    isUpdatingComment: updateCommentMutation.isPending,
    isDeletingComment: deleteCommentMutation.isPending,
    isLikingComment: likeCommentMutation.isPending,
  }
}
