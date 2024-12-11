'use client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

import React, { useState, ReactNode } from 'react'

export function ReactQueryProvider ({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}
