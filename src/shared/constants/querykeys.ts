export const QUERY_KEYS = {
  POSTS: ["posts"],
  USERS: (userId: number | null) => ["users", userId],
  COMMENTS: ["comments"],
  TAGS: ["tags"],
}
//   TEAM_MEMBERS: (teamId: string) => ["team-members", teamId],
