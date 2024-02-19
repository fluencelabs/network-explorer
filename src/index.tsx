import React from 'react'
import ReactDOM from 'react-dom/client'
import { WagmiConfig } from 'wagmi'

import { WAGMI_CONFIG } from './constants/config.ts'
import { App } from './App.tsx'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <WagmiConfig config={WAGMI_CONFIG}>
      <App />
    </WagmiConfig>
  </React.StrictMode>,
)
