import { useState, useCallback } from "react"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { Post, getPosts, getPostsBySearch, getPostsByTag, addPost, updatePost, deletePost } from "@/entities/posts"
import { getUsers } from "@/entities/users"
import { QUERY_KEYS } from "@/shared"
import { PostWithAuthor, CreatePostData, PostsQueryResult, MutationContext } from "@/features/posts/types"

export const usePostActions = (params: {
  limit: number
  skip: number
  searchQuery?: string
  tag?: string
  sortBy?: string
  order?: string
}) => {
  const queryClient = useQueryClient()
  const [selectedPost, setSelectedPost] = useState<PostWithAuthor | undefined>(undefined)

  // 사용자 데이터 가져오기 (캐시됨)
  const { data: usersData } = useQuery({
    queryKey: QUERY_KEYS.USERS.all,
    queryFn: () => getUsers({ limit: 0, select: "username,image" }),
  })

  // 게시물과 작성자 정보 결합 함수
  const fetchPostsWithAuthors = useCallback(
    async (fetchParams: typeof params): Promise<PostsQueryResult> => {
      let postsData

      if (fetchParams.searchQuery) {
        postsData = await getPostsBySearch(fetchParams.searchQuery, {
          limit: fetchParams.limit,
          skip: fetchParams.skip,
          sortBy: fetchParams.sortBy,
          order: fetchParams.order,
        })
      } else if (fetchParams.tag) {
        postsData = await getPostsByTag(fetchParams.tag, {
          limit: fetchParams.limit,
          skip: fetchParams.skip,
          sortBy: fetchParams.sortBy,
          order: fetchParams.order,
        })
      } else {
        postsData = await getPosts({
          limit: fetchParams.limit,
          skip: fetchParams.skip,
          sortBy: fetchParams.sortBy,
          order: fetchParams.order,
        })
      }

      const postsWithUsers: PostWithAuthor[] = postsData.posts.map((post) => ({
        ...post,
        author: usersData?.users.find((user) => user.id === post.userId),
      }))

      return {
        posts: postsWithUsers,
        total: postsData.total,
      }
    },
    [usersData],
  )

  // 게시물 데이터 가져오기 (useQuery 사용)
  const {
    data: postsResult,
    isLoading: loading,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.POSTS.list(params),
    queryFn: () => fetchPostsWithAuthors(params),
    enabled: !!usersData,
  })

  const posts = postsResult?.posts || []
  const total = postsResult?.total || 0

  // 게시물 추가 Mutation (낙관적 업데이트)
  const addPostMutation = useMutation<Post, Error, CreatePostData, MutationContext>({
    mutationFn: addPost,
    onMutate: async (newPostData) => {
      // 진행 중인 쿼리 취소
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.POSTS.list(params) })

      // 이전 데이터 백업
      const previousPosts = queryClient.getQueryData<PostsQueryResult>(QUERY_KEYS.POSTS.list(params))

      // 낙관적 업데이트: 임시 ID를 가진 새 게시물 즉시 추가
      const tempId = Date.now()
      const optimisticPost: PostWithAuthor = {
        id: tempId, // 임시 ID
        title: newPostData.title,
        body: newPostData.body,
        userId: newPostData.userId,
        tags: [],
        reactions: { likes: 0, dislikes: 0 },
        views: 0,
        author: usersData?.users.find((user) => user.id === newPostData.userId),
      }

      queryClient.setQueryData<PostsQueryResult>(QUERY_KEYS.POSTS.list(params), (old) =>
        old
          ? {
              posts: [optimisticPost, ...old.posts],
              total: old.total + 1,
            }
          : { posts: [optimisticPost], total: 1 },
      )

      return { previousPosts, tempId }
    },
    onError: (_, __, context) => {
      // 실패 시 이전 데이터로 롤백
      if (context?.previousPosts) {
        queryClient.setQueryData(QUERY_KEYS.POSTS.list(params), context.previousPosts)
      }
    },
    onSuccess: (serverPost, __, context) => {
      // 성공 시 서버에서 받은 실제 데이터로 업데이트
      queryClient.setQueryData<PostsQueryResult>(QUERY_KEYS.POSTS.list(params), (old) => {
        if (!old) return { posts: [], total: 0 }

        const updatedPosts = old.posts.map((post) =>
          post.id === context?.tempId ? { ...serverPost, author: post.author } : post,
        )

        return {
          posts: updatedPosts,
          total: old.total,
        }
      })
    },
  })

  // 게시물 수정 Mutation (낙관적 업데이트)
  const updatePostMutation = useMutation<Post, Error, Post, MutationContext>({
    mutationFn: updatePost,
    onMutate: async (updatedPost) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.POSTS.list(params) })

      const previousPosts = queryClient.getQueryData<PostsQueryResult>(QUERY_KEYS.POSTS.list(params))

      // 낙관적 업데이트: 즉시 게시물 수정
      queryClient.setQueryData<PostsQueryResult>(QUERY_KEYS.POSTS.list(params), (old) => {
        if (!old) return { posts: [], total: 0 }

        const updatedPosts = old.posts.map((post) =>
          post.id === updatedPost.id ? { ...updatedPost, author: post.author } : post,
        )

        return {
          posts: updatedPosts,
          total: old.total,
        }
      })

      return { previousPosts }
    },
    onError: (_, __, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(QUERY_KEYS.POSTS.list(params), context.previousPosts)
      }
    },
  })

  // 게시물 삭제 Mutation (낙관적 업데이트)
  const deletePostMutation = useMutation<unknown, Error, number, MutationContext>({
    mutationFn: deletePost,
    onMutate: async (postId) => {
      await queryClient.cancelQueries({ queryKey: QUERY_KEYS.POSTS.list(params) })

      const previousPosts = queryClient.getQueryData<PostsQueryResult>(QUERY_KEYS.POSTS.list(params))

      // 낙관적 업데이트: 즉시 게시물 제거
      queryClient.setQueryData<PostsQueryResult>(QUERY_KEYS.POSTS.list(params), (old) => {
        if (!old) return { posts: [], total: 0 }

        const filteredPosts = old.posts.filter((post) => post.id !== postId)

        return {
          posts: filteredPosts,
          total: old.total - 1,
        }
      })

      return { previousPosts }
    },
    onError: (_, __, context) => {
      if (context?.previousPosts) {
        queryClient.setQueryData(QUERY_KEYS.POSTS.list(params), context.previousPosts)
      }
    },
  })

  const addPostToList = async (postData: CreatePostData) => {
    return addPostMutation.mutateAsync(postData)
  }

  const updatePostInList = async (postToUpdate: Post) => {
    return updatePostMutation.mutateAsync(postToUpdate)
  }

  const deletePostFromList = async (postId: number): Promise<void> => {
    await deletePostMutation.mutateAsync(postId)
  }

  // 기존 함수들을 refetch로 대체
  const fetchPosts = useCallback(
    async (fetchParams: { limit: number; skip: number }) => {
      queryClient.refetchQueries({ queryKey: QUERY_KEYS.POSTS.list(fetchParams) })
    },
    [queryClient],
  )

  const searchPosts = useCallback(
    async (searchQuery: string) => {
      const searchParams = { ...params, searchQuery }
      queryClient.refetchQueries({ queryKey: QUERY_KEYS.POSTS.list(searchParams) })
    },
    [queryClient, params],
  )

  const fetchPostsByTag = useCallback(
    async (tag: string) => {
      const tagParams = { ...params, tag }
      queryClient.refetchQueries({ queryKey: QUERY_KEYS.POSTS.list(tagParams) })
    },
    [queryClient, params],
  )

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
    error,
    fetchPosts,
    searchPosts,
    fetchPostsByTag,
    addPostToList,
    updatePostInList,
    deletePostFromList,
    // Mutation loading states
    isAddingPost: addPostMutation.isPending,
    isUpdatingPost: updatePostMutation.isPending,
    isDeletingPost: deletePostMutation.isPending,
  }
}
