export const QUERY_KEYS = {
  POSTS: {
    all: ["posts"],
    list: (params: { limit: number; skip: number; searchQuery?: string; tag?: string }) => ["posts", "list", params],
    search: (query: string) => ["posts", "search", query],
    byTag: (tag: string) => ["posts", "byTag", tag],
  },
  USERS: {
    all: ["users"],
    byId: (userId: number | null) => ["users", "byId", userId],
  },

  COMMENTS: {
    all: ["comments"],
    store: ["comments", "store"], // 전체 댓글 저장소
    byPost: (postId: number) => ["comments", "byPost", postId],
  },
  TAGS: {
    all: ["tags"],
  },
}
