import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { Button, Card, CardContent, CardHeader, CardTitle, useQueryParams } from "@/shared"
import { PostsTable } from "../posts/ui/PostsTable"
import {
  getCommentsByPostId,
  getPosts,
  getPostsBySearch,
  getPostsByTag,
  getUsers,
  Post,
  User,
  Comment,
  getUserById,
  UserInfo,
} from "./apis/postsApis"
import { SearchFilterContainer } from "./SearchFilterContainer"
import { Paginations } from "./Paginations"
import { AddPostDialog } from "./AddPostDialog"
import { EditPostDialog } from "./EditPostDialog"
import { PostDetailDialog } from "./PostDetailDialog"
import { UserDialog } from "./UserDialog"

export interface PostWithAuthor extends Post {
  author?: User
}
export const PostsManagerComponent = () => {
  const { skip, limit, searchQuery, sortBy, sortOrder, selectedTag, updateURL, setSelectedTag } = useQueryParams()

  // 상태 관리
  const [posts, setPosts] = useState<PostWithAuthor[]>([])
  const [total, setTotal] = useState(0)

  const [selectedPost, setSelectedPost] = useState<PostWithAuthor>()
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [showEditDialog, setShowEditDialog] = useState(false)
  const [loading, setLoading] = useState(false)

  const [comments, setComments] = useState<Record<number, Comment[]>>({})
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false)
  const [showUserModal, setShowUserModal] = useState(false)
  const [selectedUser, setSelectedUser] = useState<UserInfo>()

  // 게시물 가져오기
  const fetchPosts = async () => {
    setLoading(true)
    const postsData = await getPosts({ limit, skip })
    const usersData = await getUsers({ limit: 0, select: "username,image" })

    const postsWithUsers: PostWithAuthor[] = postsData.posts.map((post) => ({
      ...post,
      author: usersData.users.find((user) => user.id === post.userId),
    }))
    setPosts(postsWithUsers)
    setTotal(postsData.total)
    setLoading(false)
  }

  // 게시물 검색
  const searchPosts = async () => {
    if (!searchQuery) {
      fetchPosts()
      return
    }
    setLoading(true)
    updateURL({ searchQuery })
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
    }
    setLoading(false)
  }

  // 태그별 게시물 가져오기
  const fetchPostsByTag = async (tag: string) => {
    if (!tag || tag === "all") {
      fetchPosts()
      return
    }
    setLoading(true)
    try {
      const [postsData, usersData] = await Promise.all([
        getPostsByTag(tag),
        getUsers({ limit: 0, select: "username,image" }),
      ])

      const postsWithUsers = postsData.posts.map((post) => ({
        ...post,
        author: usersData.users.find((user) => user.id === post.userId),
      }))

      setPosts(postsWithUsers)
      setTotal(postsData.total)
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", error)
    }
    setLoading(false)
  }

  // 댓글 가져오기
  const fetchComments = async (postId: number) => {
    if (comments[postId]) return // 이미 불러온 댓글이 있으면 다시 불러오지 않음
    try {
      const commentsData = await getCommentsByPostId(postId)
      setComments((prev) => ({ ...prev, [postId]: commentsData.comments }))
    } catch (error) {
      console.error("댓글 가져오기 오류:", error)
    }
  }

  // 게시물 수정 모달 열기
  const openEditDialog = (post: PostWithAuthor) => {
    setSelectedPost(post)
    setShowEditDialog(true)
  }

  // 게시물 상세 보기
  const openPostDetail = (post: PostWithAuthor) => {
    setSelectedPost(post)
    fetchComments(post.id)
    setShowPostDetailDialog(true)
  }

  // 사용자 모달 열기
  const openUserModal = async (user: User) => {
    try {
      const userData = await getUserById(user.id)
      setSelectedUser(userData)
      setShowUserModal(true)
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
    }
  }

  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag)
    } else {
      fetchPosts()
    }
    updateURL()
  }, [skip, limit, sortBy, sortOrder, selectedTag])

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
          <SearchFilterContainer
            searchPosts={searchPosts}
            selectedTag={selectedTag}
            setSelectedTag={setSelectedTag}
            fetchPostsByTag={fetchPostsByTag}
          />
          {/* 게시물 테이블 */}
          {loading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostsTable
              posts={posts}
              setPosts={setPosts}
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
        showAddDialog={showAddDialog}
        setShowAddDialog={setShowAddDialog}
        posts={posts}
        setPosts={setPosts}
      />
      {/* 게시물 수정 대화상자 */}
      {selectedPost && (
        <EditPostDialog
          showEditDialog={showEditDialog}
          setShowEditDialog={setShowEditDialog}
          selectedPost={selectedPost}
          setSelectedPost={setSelectedPost}
          posts={posts}
          setPosts={setPosts}
        />
      )}

      {/* 게시물 상세 보기 대화상자 */}
      {selectedPost && (
        <PostDetailDialog
          showPostDetailDialog={showPostDetailDialog}
          setShowPostDetailDialog={setShowPostDetailDialog}
          selectedPost={selectedPost}
        />
      )}

      {/* 사용자 모달 */}
      {selectedUser && (
        <UserDialog showUserModal={showUserModal} setShowUserModal={setShowUserModal} selectedUser={selectedUser} />
      )}
    </Card>
  )
}
