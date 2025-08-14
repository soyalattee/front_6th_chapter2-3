import { useState, useCallback } from "react"
import { Post, getPosts, getPostsBySearch, getPostsByTag, addPost, updatePost, deletePost } from "../api/postsApis"

import { User, getUsers } from "@/entities/users/api/userApis"

export interface PostWithAuthor extends Post {
  author?: User
}

export interface CreatePostData {
  title: string
  body: string
  userId: number
}

export const usePostActions = () => {
  const [posts, setPosts] = useState<PostWithAuthor[]>([])
  const [selectedPost, setSelectedPost] = useState<PostWithAuthor | undefined>(undefined)
  const [loading, setLoading] = useState(false)
  const [total, setTotal] = useState(0)

  // 게시물 가져오기
  const fetchPosts = useCallback(async (params: { limit: number; skip: number }) => {
    setLoading(true)
    try {
      const postsData = await getPosts(params)
      const usersData = await getUsers({ limit: 0, select: "username,image" })

      const postsWithUsers: PostWithAuthor[] = postsData.posts.map((post) => ({
        ...post,
        author: usersData.users.find((user) => user.id === post.userId),
      }))
      setPosts(postsWithUsers)
      setTotal(postsData.total)
    } catch (error) {
      console.error("게시물 가져오기 오류:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  // 게시물 검색
  const searchPosts = useCallback(async (searchQuery: string) => {
    setLoading(true)
    try {
      const postsData = await getPostsBySearch(searchQuery)
      const usersData = await getUsers({ limit: 0, select: "username,image" })

      const postsWithUsers: PostWithAuthor[] = postsData.posts.map((post) => ({
        ...post,
        author: usersData.users.find((user) => user.id === post.userId),
      }))
      setPosts(postsWithUsers)
      setTotal(postsData.total)
    } catch (error) {
      console.error("게시물 검색 오류:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  // 태그별 게시물 가져오기
  const fetchPostsByTag = useCallback(async (tag: string) => {
    setLoading(true)
    try {
      const [postsData, usersData] = await Promise.all([
        getPostsByTag(tag),
        getUsers({ limit: 0, select: "username,image" }),
      ])

      const postsWithUsers: PostWithAuthor[] = postsData.posts.map((post) => ({
        ...post,
        author: usersData.users.find((user) => user.id === post.userId),
      }))

      setPosts(postsWithUsers)
      setTotal(postsData.total)
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", error)
    } finally {
      setLoading(false)
    }
  }, [])

  // 게시물 추가
  const addPostToList = useCallback(async (postData: CreatePostData) => {
    try {
      const newPostData = await addPost(postData)
      setPosts((prevPosts) => [newPostData, ...prevPosts])
      return newPostData
    } catch (error) {
      console.error("게시물 추가 오류:", error)
      throw error
    }
  }, [])

  // 게시물 수정
  const updatePostInList = useCallback(async (postToUpdate: Post) => {
    try {
      const updatedPost = await updatePost(postToUpdate)
      setPosts((prevPosts) =>
        prevPosts.map((post) => (post.id === updatedPost.id ? { ...updatedPost, author: post.author } : post)),
      )
      return updatedPost
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
      throw error
    }
  }, [])

  // 게시물 삭제
  const deletePostFromList = useCallback(async (postId: number) => {
    try {
      await deletePost(postId)
      setPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId))
    } catch (error) {
      console.error("게시물 삭제 오류:", error)
      throw error
    }
  }, [])

  // 선택된 게시물 업데이트 (로컬 상태만)
  const updateSelectedPost = useCallback((updatedPost: PostWithAuthor) => {
    setSelectedPost(updatedPost)
  }, [])

  return {
    posts,
    selectedPost,
    updateSelectedPost,
    loading,
    total,
    fetchPosts,
    searchPosts,
    fetchPostsByTag,
    addPostToList,
    updatePostInList,
    deletePostFromList,
  }
}
