import { api } from "@/shared/api/api"

export type CommentUser = { id: number; username: string; fullName: string }

export type Comment = { id: number; body: string; likes: number; postId: number; user: CommentUser }

export interface CommentsResponse {
  comments: Comment[]
  limit: number
  skip: number
  total: number
}

export interface AddCommentResponse {
  id: number
  body: string
  postId: number
  user: CommentUser
}
export interface UpdateCommentResponse extends Comment {
  user: CommentUser
}
export interface DeleteCommentResponse extends Comment {
  isDeleted: boolean
  user: CommentUser
}

export interface LikeCommentRequest {
  likes: number
}
// 게시물 댓글 가져오기
export const getCommentsByPostId = async (postId: number): Promise<CommentsResponse> => {
  return api.get<CommentsResponse>(`/comments/post/${postId}`)
}

// 댓글 추가
export const addComment = async (comment: Comment): Promise<AddCommentResponse> => {
  return api.post<AddCommentResponse, Comment>("/comments/add", comment)
}

// 댓글 수정
export const updateComment = async (commentId: number, comment: Comment): Promise<UpdateCommentResponse> => {
  return api.put<UpdateCommentResponse, Comment>(`/comments/${commentId}`, comment)
}

// 댓글 삭제
export const deleteComment = async (id: number): Promise<DeleteCommentResponse> => {
  return api.delete<DeleteCommentResponse>(`/comments/${id}`)
}

// 댓글 좋아요
export const likeComment = async (id: number, likes: LikeCommentRequest): Promise<UpdateCommentResponse> => {
  return api.patch<UpdateCommentResponse, LikeCommentRequest>(`/comments/${id}`, likes)
}
