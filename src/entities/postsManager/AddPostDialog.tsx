import { Button, Dialog, DialogContent, DialogHeader, DialogTitle, Input, Textarea } from "@/shared"
import { addPost, Post } from "./apis/postsApis"
import { useState } from "react"

interface AddPostDialogProps {
  showAddDialog: boolean
  setShowAddDialog: (show: boolean) => void
  posts: Post[]
  setPosts: (posts: Post[]) => void
}
interface CreatePost {
  title: string
  body: string
  userId: number
}
export const AddPostDialog = ({ showAddDialog, setShowAddDialog, posts, setPosts }: AddPostDialogProps) => {
  const [newPost, setNewPost] = useState<CreatePost>({ title: "", body: "", userId: 1 })

  // 게시물 추가
  const handleAddPost = async () => {
    try {
      const newPostData = await addPost(newPost)
      setPosts([newPostData, ...posts])
      setShowAddDialog(false)
      //초기화
      setNewPost({ title: "", body: "", userId: 1 })
    } catch (error) {
      console.error("게시물 추가 오류:", error)
    }
  }

  return (
    <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={newPost.title}
            onChange={(e) => setNewPost({ ...newPost, title: e.target.value })}
          />
          <Textarea
            rows={30}
            placeholder="내용"
            value={newPost.body}
            onChange={(e) => setNewPost({ ...newPost, body: e.target.value })}
          />
          <Input
            type="number"
            placeholder="사용자 ID"
            value={newPost.userId}
            onChange={(e) => setNewPost({ ...newPost, userId: Number(e.target.value) })}
          />
          <Button onClick={handleAddPost}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
