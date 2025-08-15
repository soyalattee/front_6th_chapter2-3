import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, useQueryParams } from "@/shared"
import { Search } from "lucide-react"
import { useState } from "react"
import { useTagActions } from "@/features/posts"

interface SearchFilterContainerProps {
  searchPosts: () => void
  fetchPostsByTag: (tag: string) => void
}

export const SearchFilterContainer = ({ searchPosts, fetchPostsByTag }: SearchFilterContainerProps) => {
  const { searchQuery, sortBy, order, setSearchQuery, setSortBy, setOrder, selectedTag, setSelectedTag } =
    useQueryParams()
  const { tags, isLoading: isTagsLoading } = useTagActions()

  const [searchValue, setSearchValue] = useState(searchQuery)

  // 검색 핸들러
  const handleSearch = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setSearchQuery(searchValue)
      searchPosts()
    }
  }

  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="게시물 검색..."
            className="pl-8"
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onKeyDown={handleSearch}
          />
        </div>
      </div>
      <Select
        value={selectedTag}
        onValueChange={(value) => {
          setSelectedTag(value)
          fetchPostsByTag(value)
        }}
      >
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="태그 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 태그</SelectItem>
          {tags &&
            tags.map((tag) => (
              <SelectItem key={tag.url} value={tag.slug}>
                {tag.slug}
              </SelectItem>
            ))}
          {isTagsLoading && <SelectItem value="loading">로딩중...</SelectItem>}
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 기준" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="none">없음</SelectItem>
          <SelectItem value="id">ID</SelectItem>
          <SelectItem value="title">제목</SelectItem>
          <SelectItem value="reactions">반응</SelectItem>
        </SelectContent>
      </Select>
      <Select value={order} onValueChange={setOrder}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 순서" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">오름차순</SelectItem>
          <SelectItem value="desc">내림차순</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
