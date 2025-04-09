import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { WagmiProvider } from 'wagmi'

import { ClientProvider } from './components/ClientProvider.tsx'

import { WAGMI_CONFIG } from './constants/config.ts'
import { App } from './App.tsx'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes in milliseconds
      refetchOnWindowFocus: false,
      refetchOnMount: false,
    },
  },
})

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WagmiProvider config={WAGMI_CONFIG}>
      <QueryClientProvider client={queryClient}>
        <ClientProvider>
          <App />
        </ClientProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
