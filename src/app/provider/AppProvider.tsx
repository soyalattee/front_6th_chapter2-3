import { ReactNode } from "react"
import { QueryProvider } from "@/app/provider/QueryProvider"
import { NuqsProvider } from "@/app/provider/NuqsProvider"

interface AppProviderProps {
  children: ReactNode
}

export const AppProvider = ({ children }: AppProviderProps) => {
  return (
    <QueryProvider>
      <NuqsProvider>{children}</NuqsProvider>
    </QueryProvider>
  )
}
