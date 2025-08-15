export interface CommentUser {
  id: number
  username: string
  fullName: string
}

export interface Comment {
  id: number
  body: string
  likes: number
  postId: number
  user: CommentUser
}

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
export interface DeleteCommentResponse {
  isDeleted: boolean
}

export interface UpdateCommentRequest {
  body: string
}
export interface AddCommentRequest {
  body: string
  postId: number
  userId: number
}
export interface LikeCommentRequest {
  likes: number
}
