import { useState, useCallback } from "react"
import { Plus } from "lucide-react"
import { Button, Card, CardContent, CardHeader, CardTitle, useQueryParams } from "@/shared"
import { PostsTable } from "@/features/posts/ui/PostsTable"
import { SearchFilterContainer } from "../../../features/posts/ui/SearchFilterContainer"
import { Paginations } from "../../../features/posts/ui/Paginations"
import { AddPostDialog } from "../../../features/posts/ui/AddPostDialog"
import { EditPostDialog, PostEditData } from "../../../features/posts/ui/EditPostDialog"
import { PostDetailDialog } from "./PostDetailDialog"
import { UserDialog } from "@/entities/users/ui/UserDialog"
import { usePostActions } from "@/features/posts/hooks/usePostActions"
import { CreatePostData, PostWithAuthor } from "@/features/posts/types"
import { useUserActions } from "@/entities/users/hooks/useUserActions"

export const PostsManagerComponent = () => {
  const { skip, limit, searchQuery, selectedTag, sortBy, order } = useQueryParams()

  const {
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
    isAddingPost,
    isUpdatingPost,
  } = usePostActions({ limit, skip, searchQuery, tag: selectedTag, sortBy, order })

  const { selectedUser, isLoadingUser, selectUser, clearSelectedUser } = useUserActions()

  // Dialog 상태 관리
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)

  // 폼 데이터 상태
  const [newPostData, setNewPostData] = useState<CreatePostData>({ title: "", body: "", userId: 1 })
  const [editPostData, setEditPostData] = useState<PostEditData | null>(null)

  // 게시물 추가 핸들러
  const handleAddPost = async () => {
    if (newPostData.title.trim() === "" || newPostData.body.trim() === "") {
      alert("제목과 내용을 모두 입력해주세요.")
      return
    }

    try {
      await addPostToList(newPostData)
      setShowAddDialog(false)
      setNewPostData({ title: "", body: "", userId: 1 })
    } catch (error) {
      console.error("게시물 추가 실패:", error)
    }
  }

  // 게시물 수정 핸들러
  const handleUpdatePost = async () => {
    if (!editPostData) return

    try {
      await updatePostInList({
        id: editPostData.id,
        title: editPostData.title,
        body: editPostData.body,
        userId: editPostData.userId,
        tags: editPostData.tags,
        reactions: editPostData.reactions,
        views: editPostData.views,
      })
      setShowEditDialog(false)
    } catch (error) {
      console.error("게시물 수정 실패:", error)
    }
  }

  // 검색 핸들러
  const handleSearchPosts = useCallback(async () => {
    if (!searchQuery) {
      await fetchPosts({ limit, skip })
      return
    }
    await searchPosts(searchQuery)
  }, [searchQuery, limit, skip, fetchPosts, searchPosts])

  // 태그별 게시물 가져오기 핸들러
  const handleFetchPostsByTag = useCallback(
    async (tag: string) => {
      if (!tag || tag === "all") {
        await fetchPosts({ limit, skip })
        return
      }
      await fetchPostsByTag(tag)
    },
    [limit, skip, fetchPosts, fetchPostsByTag],
  )

  // 게시물 수정 모달 열기
  const openEditDialog = (post: PostWithAuthor) => {
    updateSelectedPost(post)
    setEditPostData({
      id: post.id,
      title: post.title,
      body: post.body,
      userId: post.userId,
      tags: post.tags,
      reactions: post.reactions,
      views: post.views,
    })
    setShowEditDialog(true)
  }

  // 게시물 상세모달 열기
  const openPostDetail = (post: PostWithAuthor) => {
    updateSelectedPost(post)
    setShowPostDetailDialog(true)
  }

  // 사용자 모달 열기
  const openUserModal = (userId: number) => {
    selectUser(userId)
    setShowUserModal(true)
  }

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setShowAddDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <SearchFilterContainer searchPosts={handleSearchPosts} fetchPostsByTag={handleFetchPostsByTag} />
          {/* 게시물 테이블 */}
          {loading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostsTable
              posts={posts}
              deletePost={deletePostFromList}
              openPostDetail={openPostDetail}
              openUserModal={openUserModal}
              openEditDialog={openEditDialog}
            />
          )}

          {/* 페이지네이션 */}
          <Paginations total={total} />
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <AddPostDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        postData={newPostData}
        onPostDataChange={setNewPostData}
        onAddPost={handleAddPost}
        isLoading={isAddingPost}
      />

      {/* 게시물 수정 대화상자 */}
      <EditPostDialog
        open={showEditDialog}
        onOpenChange={setShowEditDialog}
        post={editPostData}
        onPostChange={setEditPostData}
        onUpdatePost={handleUpdatePost}
        isLoading={isUpdatingPost}
      />

      {/* 게시물 상세 보기 대화상자 */}
      {selectedPost && (
        <PostDetailDialog
          showPostDetailDialog={showPostDetailDialog}
          setShowPostDetailDialog={setShowPostDetailDialog}
          selectedPost={selectedPost}
        />
      )}

      {/* 사용자 모달 */}
      <UserDialog
        open={showUserModal}
        onOpenChange={(open) => {
          setShowUserModal(open)
          if (!open) {
            clearSelectedUser()
          }
        }}
        selectedUser={selectedUser}
        isLoading={isLoadingUser}
      />
    </Card>
  )
}
