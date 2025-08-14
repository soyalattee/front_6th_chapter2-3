import { BrowserRouter, Route, Routes } from "react-router-dom"
import { NuqsAdapter } from "nuqs/adapters/react-router"
import { PostsManagerPage } from "@/pages"

const AppRouter = () => {
  return (
    <BrowserRouter>
      <NuqsAdapter>
        <Routes>
          <Route path="/" element={<PostsManagerPage />} />
        </Routes>
      </NuqsAdapter>
    </BrowserRouter>
  )
}

export default AppRouter
