import { Post } from "@/entities/posts"
import { User } from "@/entities/users"

export interface CreatePostData {
  title: string
  body: string
  userId: number
}

export interface PostWithAuthor extends Post {
  author?: User
}

export interface PostsQueryResult {
  posts: PostWithAuthor[]
  total: number
}

export interface MutationContext {
  previousPosts?: PostsQueryResult
  tempId?: number
}
