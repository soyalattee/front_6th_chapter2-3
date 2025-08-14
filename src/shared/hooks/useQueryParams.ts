import { parseAsInteger, parseAsString, useQueryStates } from "nuqs"
import { useCallback } from "react"

// TODO: 추후 entities 폴더에 필요에 따라 나눠 이동하고 여기는 파라미터 타입체킹만 놓기
export interface QueryParamsState {
  skip: number
  setSkip: (value: number | null) => void
  limit: number
  setLimit: (value: number | null) => void
  searchQuery: string
  setSearchQuery: (value: string | null) => void
  sortBy: string
  setSortBy: (value: string | null) => void
  order: string
  setOrder: (value: string | null) => void
  selectedTag: string
  setSelectedTag: (value: string | null) => void
}

export const useQueryParams = (): QueryParamsState => {
  // nuqs useQueryStates를 사용해 모든 쿼리 파라미터를 한 번에 관리
  const [queryParams, setQueryParams] = useQueryStates(
    {
      skip: parseAsInteger.withDefault(0),
      limit: parseAsInteger.withDefault(10),
      search: parseAsString.withDefault(""),
      sortBy: parseAsString.withDefault("id"),
      order: parseAsString.withDefault("asc"),
      tag: parseAsString.withDefault(""),
    },
    {
      // shallow: false, // URL 변경시 컴포넌트 리렌더링을 제어
      // throttleMs: 50, // 빠른 연속 업데이트를 제한
    },
  )

  const { skip, limit, search: searchQuery, sortBy, order, tag: selectedTag } = queryParams

  // 개별 setter 함수들
  const setSkip = useCallback(
    (value: number | null) => {
      setQueryParams({ skip: value })
    },
    [setQueryParams],
  )

  const setLimit = useCallback(
    (value: number | null) => {
      setQueryParams({ limit: value })
    },
    [setQueryParams],
  )

  const setSearchQuery = useCallback(
    (value: string | null) => {
      setQueryParams({ search: value })
    },
    [setQueryParams],
  )

  const setSortBy = useCallback(
    (value: string | null) => {
      setQueryParams({ sortBy: value })
    },
    [setQueryParams],
  )

  const setOrder = useCallback(
    (value: string | null) => {
      setQueryParams({ order: value })
    },
    [setQueryParams],
  )

  const setSelectedTag = useCallback(
    (value: string | null) => {
      setQueryParams({ tag: value })
    },
    [setQueryParams],
  )

  return {
    skip,
    setSkip,
    limit,
    setLimit,
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    order,
    setOrder,
    selectedTag,
    setSelectedTag,
  }
}
