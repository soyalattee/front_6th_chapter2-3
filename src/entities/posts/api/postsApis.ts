import { api } from "@/shared/api/api"
import { PostsResponse, TagsResponse, Post } from "@/entities/posts/types"

// API 함수

// 게시물 가져오기
export const getPosts = async (params: {
  limit: number
  skip: number
  sortBy?: string
  order?: string
}): Promise<PostsResponse> => {
  return api.get<PostsResponse>(`/posts`, { params })
}

// 검색으로 게시물 가져오기
export const getPostsBySearch = async (
  q: string,
  params: { limit: number; skip: number; sortBy?: string; order?: string },
): Promise<PostsResponse> => {
  return api.get<PostsResponse>(`/posts/search`, { params: { q, ...params } })
}

// 태그별 게시물 가져오기
export const getPostsByTag = async (
  tag: string,
  params: { limit: number; skip: number; sortBy?: string; order?: string },
): Promise<PostsResponse> => {
  return api.get<PostsResponse>(`/posts/tag/${tag}`, { params })
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

// 게시물 삭제
export const deletePost = async (id: number): Promise<unknown> => {
  return api.delete<unknown>(`/posts/${id}`)
}
