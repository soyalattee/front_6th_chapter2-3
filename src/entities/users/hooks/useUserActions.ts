import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { getUserById } from "@/entities/users/api"
import { QUERY_KEYS } from "@/shared"

export const useUserActions = () => {
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)

  // 선택된 사용자 정보 가져오기
  const {
    data: selectedUser = null,
    isLoading: isLoadingUser,
    error,
  } = useQuery({
    queryKey: QUERY_KEYS.USERS.byId(selectedUserId),
    queryFn: () => getUserById(selectedUserId!),
    enabled: !!selectedUserId,
  })

  // 사용자 선택
  const selectUser = (userId: number) => {
    setSelectedUserId(userId)
  }

  // 사용자 선택 해제
  const clearSelectedUser = () => {
    setSelectedUserId(null)
  }

  return {
    selectedUser,
    selectedUserId,
    isLoadingUser,
    error,
    selectUser,
    clearSelectedUser,
  }
}
