export const QUERY_KEYS = {
  POSTS: ["posts"],
  USERS: (userId: number | null) => ["users", userId],
  COMMENTS: {
    all: ["comments"],
    store: ["comments", "store"], // 전체 댓글 저장소
    byPost: (postId: number) => ["comments", "byPost", postId],
  },
  TAGS: ["tags"],
}
