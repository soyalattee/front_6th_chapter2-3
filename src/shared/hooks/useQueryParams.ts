import { useEffect, useState, useCallback } from "react"
import { useLocation, useNavigate } from "react-router-dom"

// TODO: 추후 entities 폴더에 필요에 따라 나눠 이동하고 여기는 파라미터 타입체킹만 놓기
export interface QueryParamsState {
  skip: number
  setSkip: React.Dispatch<React.SetStateAction<number>>
  limit: number
  setLimit: React.Dispatch<React.SetStateAction<number>>
  searchQuery: string
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>
  sortBy: string
  setSortBy: React.Dispatch<React.SetStateAction<string>>
  sortOrder: string
  setSortOrder: React.Dispatch<React.SetStateAction<string>>
  selectedTag: string
  setSelectedTag: React.Dispatch<React.SetStateAction<string>>
  updateURL: (
    next?: Partial<{
      skip: number
      limit: number
      searchQuery: string
      sortBy: string
      sortOrder: string
      selectedTag: string
    }>,
  ) => void
}

export const useQueryParams = (): QueryParamsState => {
  const navigate = useNavigate()
  const location = useLocation()

  const queryParams = new URLSearchParams(location.search)

  const [skip, setSkip] = useState<number>(parseInt(queryParams.get("skip") || "0"))
  const [limit, setLimit] = useState<number>(parseInt(queryParams.get("limit") || "10"))
  const [searchQuery, setSearchQuery] = useState<string>(queryParams.get("search") || "")
  const [sortBy, setSortBy] = useState<string>(queryParams.get("sortBy") || "")
  const [sortOrder, setSortOrder] = useState<string>(queryParams.get("sortOrder") || "asc")
  const [selectedTag, setSelectedTag] = useState<string>(queryParams.get("tag") || "")

  const updateURL = useCallback(
    (
      next?: Partial<{
        skip: number
        limit: number
        searchQuery: string
        sortBy: string
        sortOrder: string
        selectedTag: string
      }>,
    ) => {
      const effective = {
        skip,
        limit,
        searchQuery,
        sortBy,
        sortOrder,
        selectedTag,
        ...next,
      }

      const newParams = new URLSearchParams()
      if (effective.skip) newParams.set("skip", String(effective.skip))
      if (effective.limit) newParams.set("limit", String(effective.limit))
      if (effective.searchQuery) newParams.set("search", effective.searchQuery)
      if (effective.sortBy) newParams.set("sortBy", effective.sortBy)
      if (effective.sortOrder) newParams.set("sortOrder", effective.sortOrder)
      if (effective.selectedTag) newParams.set("tag", effective.selectedTag)

      navigate(`?${newParams.toString()}`)
    },
    [skip, limit, searchQuery, sortBy, sortOrder, selectedTag, navigate],
  )

  useEffect(() => {
    const p = new URLSearchParams(location.search)
    setSkip(parseInt(p.get("skip") || "0"))
    setLimit(parseInt(p.get("limit") || "10"))
    setSearchQuery(p.get("search") || "")
    setSortBy(p.get("sortBy") || "")
    setSortOrder(p.get("sortOrder") || "asc")
    setSelectedTag(p.get("tag") || "")
  }, [location.search])

  return {
    skip,
    setSkip,
    limit,
    setLimit,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    sortOrder,
    setSortOrder,
    selectedTag,
    setSelectedTag,
    updateURL,
  }
}
