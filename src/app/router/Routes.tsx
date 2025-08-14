import { Route, Routes as ReactRouterRoutes } from "react-router-dom"
import { PostsManagerPage } from "@/pages"

export const Routes = () => {
  return (
    <ReactRouterRoutes>
      <Route path="/" element={<PostsManagerPage />} />
    </ReactRouterRoutes>
  )
}
