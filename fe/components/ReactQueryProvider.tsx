'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import React, { useState, ReactNode } from 'react'

export function ReactQueryProvider ({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())
  //   const queryClient = useQueryClient()

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

// import { QueryClient, QueryClientProvider } from 'react-query'

// const queryClient = new QueryClient()

// export const ReactQueryProvider = ({ children }) => (
//   <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
// )
