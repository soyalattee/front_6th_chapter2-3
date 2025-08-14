import { useEffect, useState } from "react"
import { getTags, Tag } from "../api/postsApis"

export const useTagActions = () => {
  const [tags, setTags] = useState<Tag[]>([])

  const fetchTags = async () => {
    const tagsData = await getTags()
    setTags(tagsData)
  }
  useEffect(() => {
    fetchTags()
  }, [])
  return { tags, fetchTags }
}
