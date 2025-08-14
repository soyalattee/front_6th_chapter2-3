import { PropsWithChildren } from "react"
import { BrowserRouter } from "react-router-dom"
import { AppProvider } from "../provider"

export const RouterProvider = ({ children }: PropsWithChildren) => {
  return (
    <BrowserRouter>
      <AppProvider>{children}</AppProvider>
    </BrowserRouter>
  )
}
