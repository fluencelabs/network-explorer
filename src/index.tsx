import React from 'react'
import ReactDOM from 'react-dom/client'
import { lightTheme, RainbowKitProvider, Theme } from '@rainbow-me/rainbowkit'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import merge from 'lodash.merge'
import { WagmiProvider } from 'wagmi'

import { WAGMI_CONFIG } from './constants/config.ts'
import { App } from './App.tsx'

import '@rainbow-me/rainbowkit/styles.css'

const queryClient = new QueryClient()

const myTheme = merge(lightTheme(), {
  radii: {
    connectButton: '4px',
  },
} as Theme)

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WagmiProvider config={WAGMI_CONFIG}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider theme={myTheme}>
          <App />
        </RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  </React.StrictMode>,
)
