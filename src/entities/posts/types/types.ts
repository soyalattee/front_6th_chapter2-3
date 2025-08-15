export type Reaction = { likes: number; dislikes: number }

export interface PostsResponse {
  limit: number
  posts: Post[]
  total: number
  skip: number
}

export type Post = {
  id: number
  body: string
  title: string
  userId: number
  views: number
  tags: string[]
  reactions: Reaction
}

export type Tag = { url: string; slug: string; name: string }
export type TagsResponse = Tag[]
