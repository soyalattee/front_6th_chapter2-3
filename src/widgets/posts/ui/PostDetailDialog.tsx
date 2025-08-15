import { Dialog, DialogContent, DialogHeader, DialogTitle, useQueryParams } from "@/shared"
import { HighlightText } from "@/shared"
import { Comments } from "@/features/comments/ui/Comments"
import { PostWithAuthor } from "@/features/posts/types"

interface PostDetailDialogProps {
  showPostDetailDialog: boolean
  setShowPostDetailDialog: (show: boolean) => void
  selectedPost: PostWithAuthor
}
export const PostDetailDialog = ({
  showPostDetailDialog,
  setShowPostDetailDialog,
  selectedPost,
}: PostDetailDialogProps) => {
  const { searchQuery } = useQueryParams()

  return (
    <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            <HighlightText text={selectedPost?.title || ""} highlight={searchQuery} />
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            <HighlightText text={selectedPost?.body || ""} highlight={searchQuery} />
          </p>
          {selectedPost && <Comments postId={selectedPost.id} />}
        </div>
      </DialogContent>
    </Dialog>
  )
}
