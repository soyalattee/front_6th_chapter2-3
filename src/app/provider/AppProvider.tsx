import { ReactNode } from "react"
import { QueryProvider } from "./QueryProvider"
import { NuqsProvider } from "./NuqsProvider"

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
