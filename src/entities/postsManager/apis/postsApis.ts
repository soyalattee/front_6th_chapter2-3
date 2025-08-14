import { api } from "@/shared/api/api"

// Types aligned with PostsManagerPage expectations
export type Reaction = { likes: number; dislikes: number }
export type User = {
  id: number
  username: string
  image: string
}

interface Address {
  address: string
  city: string
  country: string
  state: string
  stateCode: string
  postalCode: string
  coordinates: {
    lat: number
    lng: number
  }
}
export interface UserInfo {
  id: number
  image: string
  age: number
  username: string
  lastName: string
  firstName: string
  email?: string
  phone?: string
  company: {
    address: Address
    department: string
    name: string
    title: string
  }
  address: Address
  role: string
}

export interface UsersResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}

export interface PostsResponse {
  limit: number
  posts: Post[]
  total: number
  skip: number
}

export interface CommentsResponse {
  comments: Comment[]
  limit: number
  skip: number
  total: number
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
export type CommentUser = { id: number; username: string; fullName: string }
export type Comment = { id: number; body: string; likes: number; postId: number; user: CommentUser }

// API 함수

// 게시물 가져오기
export const getPosts = async (params: { limit: number; skip: number }): Promise<PostsResponse> => {
  return api.get<PostsResponse>(`/posts`, { params })
}

// 검색으로 게시물 가져오기
export const getPostsBySearch = async (q: string): Promise<PostsResponse> => {
  return api.get<PostsResponse>(`/posts/search`, { params: { q } })
}

// 태그별 게시물 가져오기
export const getPostsByTag = async (tag: string): Promise<PostsResponse> => {
  return api.get<PostsResponse>(`/posts/tag/${tag}`)
}

// 유저 가져오기
export const getUsers = async (params: { limit: number; skip?: number; select?: string }): Promise<UsersResponse> => {
  return api.get<UsersResponse>(`/users`, { params })
}

export const getUserById = async (id: number): Promise<UserInfo> => {
  return api.get<UserInfo>(`/users/${id}`)
}

// 태그 가져오기
export const getTags = async (): Promise<TagsResponse> => {
  return api.get<TagsResponse>(`/posts/tags`)
}

// 게시물 추가
export const addPost = async (post: { title: string; body: string; userId: number }): Promise<Post> => {
  return api.post<Post, typeof post>(`/posts/add`, post)
}

// 게시물 수정
export const updatePost = async (post: Post): Promise<Post> => {
  return api.put<Post, Post>(`/posts/${post.id}`, post)
}

// 게시물 댓글 가져오기
export const getCommentsByPostId = async (postId: number): Promise<CommentsResponse> => {
  return api.get<CommentsResponse>(`/comments/post/${postId}`)
}

//  ai 가 짠거
// Fetch posts and merge author info from users lightweight endpoint
export const getPostsWithAuthors = async (params: {
  limit: number
  skip: number
}): Promise<{ posts: Post[]; total: number }> => {
  const { limit, skip } = params
  const postsData = await api.get<PostsResponse>(`/posts`, { params: { limit, skip } })
  const usersData = await api.get<UsersResponse>(`/users`, { params: { limit: 0, select: "username,image" } })

  const postsWithAuthors: Post[] = postsData.posts.map((post) => ({
    ...post,
    author: usersData.users.find((u) => u.id === post.userId),
  }))
  return { posts: postsWithAuthors, total: postsData.total }
}

export const searchPosts = async (query: string): Promise<{ posts: Post[]; total: number }> => {
  return api.get<{ posts: Post[]; total: number }>(`/posts/search`, { params: { q: query } })
}

export const getPostsByTagWithAuthors = async (tag: string): Promise<{ posts: Post[]; total: number }> => {
  const postsData = await api.get<PostsResponse>(`/posts/tag/${encodeURIComponent(tag)}`)
  const usersData = await api.get<UsersResponse>(`/users`, { params: { limit: 0, select: "username,image" } })
  const postsWithAuthors: Post[] = postsData.posts.map((post) => ({
    ...post,
    author: usersData.users.find((u) => u.id === post.userId),
  }))
  return { posts: postsWithAuthors, total: postsData.total }
}

export const deletePost = async (id: number): Promise<unknown> => {
  return api.delete<unknown>(`/posts/${id}`)
}
