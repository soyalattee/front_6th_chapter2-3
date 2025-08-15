import { api } from "@/shared/api/api"
import {
  Comment,
  CommentsResponse,
  AddCommentRequest,
  AddCommentResponse,
  UpdateCommentRequest,
  DeleteCommentResponse,
  LikeCommentRequest,
} from "@/entities/comments/types"

// 게시물 댓글 가져오기
export const getCommentsByPostId = async (postId: number): Promise<CommentsResponse> => {
  return api.get<CommentsResponse>(`/comments/post/${postId}`)
}

// 댓글 추가
export const addComment = async (addedComment: AddCommentRequest): Promise<AddCommentResponse> => {
  return api.post<AddCommentResponse, AddCommentRequest>("/comments/add", addedComment)
}

// 댓글 수정
export const updateComment = async (commentId: number, commentBody: UpdateCommentRequest): Promise<Comment> => {
  return api.put<Comment, UpdateCommentRequest>(`/comments/${commentId}`, commentBody)
}

// 댓글 삭제
export const deleteComment = async (id: number): Promise<DeleteCommentResponse> => {
  return api.delete<DeleteCommentResponse>(`/comments/${id}`)
}

// 댓글 좋아요
export const likeComment = async (id: number, likes: LikeCommentRequest): Promise<Comment> => {
  return api.patch<Comment, LikeCommentRequest>(`/comments/${id}`, likes)
}
