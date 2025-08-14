import { NuqsAdapter } from "nuqs/adapters/react-router"
import { ReactNode } from "react"

interface NuqsProviderProps {
  children: ReactNode
}

export const NuqsProvider = ({ children }: NuqsProviderProps) => {
  return <NuqsAdapter>{children}</NuqsAdapter>
}
