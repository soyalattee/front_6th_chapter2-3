import { api } from "@/shared/api/api"
import { UsersResponse, UserInfo } from "@/entities/users/types"
// 유저 가져오기
export const getUsers = async (params: { limit: number; skip?: number; select?: string }): Promise<UsersResponse> => {
  return api.get<UsersResponse>(`/users`, { params })
}

export const getUserById = async (id: number): Promise<UserInfo> => {
  return api.get<UserInfo>(`/users/${id}`)
}
