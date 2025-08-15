import { PropsWithChildren } from "react"
import { BrowserRouter } from "react-router-dom"
import { AppProvider } from "@/app/provider"

export const RouterProvider = ({ children }: PropsWithChildren) => {
  const basename = import.meta.env.PROD ? "/front_6th_chapter2-3" : ""

  return (
    <BrowserRouter basename={basename}>
      <AppProvider>{children}</AppProvider>
    </BrowserRouter>
  )
}
