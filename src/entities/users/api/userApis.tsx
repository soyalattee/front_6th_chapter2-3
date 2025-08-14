import { api } from "@/shared/api/api"

export type User = {
  id: number
  username: string
  image: string
}

interface Address {
  address: string
  city: string
  country: string
  state: string
  stateCode: string
  postalCode: string
  coordinates: {
    lat: number
    lng: number
  }
}

export interface UserInfo {
  id: number
  image: string
  age: number
  username: string
  lastName: string
  firstName: string
  email?: string
  phone?: string
  company: {
    address: Address
    department: string
    name: string
    title: string
  }
  address: Address
  role: string
}

export interface UsersResponse {
  users: User[]
  total: number
  skip: number
  limit: number
}

// 유저 가져오기
export const getUsers = async (params: { limit: number; skip?: number; select?: string }): Promise<UsersResponse> => {
  return api.get<UsersResponse>(`/users`, { params })
}

export const getUserById = async (id: number): Promise<UserInfo> => {
  return api.get<UserInfo>(`/users/${id}`)
}
