import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "@/shared"
import { PostWithAuthor } from "./PostsManagerPage"
import { Post, updatePost } from "./apis/postsApis"

interface EditPostDialogProps {
  showEditDialog: boolean
  setShowEditDialog: (show: boolean) => void
  selectedPost: PostWithAuthor
  setSelectedPost: (post: PostWithAuthor) => void
  posts: PostWithAuthor[]
  setPosts: (posts: PostWithAuthor[]) => void
}
export const EditPostDialog = ({
  showEditDialog,
  setShowEditDialog,
  selectedPost,
  setSelectedPost,
  posts,
  setPosts,
}: EditPostDialogProps) => {
  // 게시물 업데이트
  const handleUpdatePost = async () => {
    if (!selectedPost) return

    try {
      const editedPost: Post = {
        id: selectedPost.id,
        title: selectedPost.title,
        body: selectedPost.body,
        userId: selectedPost.userId,
        tags: selectedPost.tags,
        reactions: selectedPost.reactions,
        views: selectedPost.views,
      }
      const updatedPost = await updatePost(editedPost)
      setPosts(posts.map((post) => (post.id === updatedPost.id ? updatedPost : post)))
      setShowEditDialog(false)
    } catch (error) {
      console.error("게시물 업데이트 오류:", error)
    }
  }
  return (
    <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={selectedPost?.title || ""}
            onChange={(e) => setSelectedPost({ ...selectedPost, title: e.target.value } as PostWithAuthor)}
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={selectedPost?.body || ""}
            onChange={(e) => setSelectedPost({ ...selectedPost, body: e.target.value } as PostWithAuthor)}
          />
          <Button onClick={handleUpdatePost}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
