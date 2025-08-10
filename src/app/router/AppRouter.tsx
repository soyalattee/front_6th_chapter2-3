import { BrowserRouter, Route, Routes } from "react-router-dom"
import { PostsManagerPage } from "@/pages"

const AppRouter = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<PostsManagerPage />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter
