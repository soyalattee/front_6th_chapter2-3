import { useQuery } from "@tanstack/react-query"
import { getTags } from "../api/postsApis"
import { QUERY_KEYS } from "@/shared"

export const useTagActions = () => {
  const { data: tags = [], isLoading } = useQuery({
    queryKey: QUERY_KEYS.TAGS,
    queryFn: getTags,
    staleTime: 1000 * 60 * 10, // 10분간 fresh (태그는 자주 변경되지 않음)
  })

  return {
    tags,
    isLoading,
  }
}
