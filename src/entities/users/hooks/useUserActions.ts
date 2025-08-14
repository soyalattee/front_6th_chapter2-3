import { useState, useCallback } from "react"
import { UserInfo, getUserById } from "@/entities/users/api/userApis"

export const useUserActions = () => {
  const [selectedUser, setSelectedUser] = useState<UserInfo | null>(null)

  // 사용자 정보 가져오기
  const fetchUserById = useCallback(async (userId: number) => {
    try {
      const userData = await getUserById(userId)
      setSelectedUser(userData)
      return userData
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error)
      throw error
    }
  }, [])

  return {
    selectedUser,
    fetchUserById,
  }
}
