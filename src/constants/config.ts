import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { defineChain } from 'viem'

// The network name for fluence contract clients: {kras, dar, local}
export const FLUENCE_CLIENT_NETWORK =
  import.meta.env.VITE_FLUENCE_CLIENT_NETWORK ?? 'local'
export const BLOCKSCOUT_URL =
  import.meta.env.VITE_BLOCKSCOUT_URL ?? 'http://localhost:4000/'
export const RPC_URL = import.meta.env.VITE_RPC_URL ?? 'http://localhost:8545'

export const WAGMI_CONFIG = getDefaultConfig({
  chains: [
    defineChain({
      id: parseInt(import.meta.env.VITE_CHAIN_ID ?? 0x8613d62c79827),
      name: FLUENCE_CLIENT_NETWORK,
      nativeCurrency: {
        decimals: 18,
        name: import.meta.env.VITE_CHAIN_NATIVE_TOKEN_NAME ?? 'Fluence',
        symbol: import.meta.env.VITE_CHAIN_NATIVE_TOKEN_SYNBOL ?? 'tFLT',
      },
      rpcUrls: {
        default: { http: [RPC_URL] },
      },
      blockExplorers: {
        default: {
          name: 'Blockscout',
          url: BLOCKSCOUT_URL,
        },
      },
    }),
  ],
  projectId: import.meta.env.VITE_WC_PROJECT_ID,
  appName: 'Fluence Network Explorer',
})

export const FILTER_ONLY_APPROVED_PROVIDERS_DEFAULT =
  import.meta.env.VITE_FILTER_ONLY_APPROVED_PROVIDERS_DEFAULT != undefined
    ? import.meta.env.VITE_FILTER_ONLY_APPROVED_PROVIDERS_DEFAULT == 'true'
    : true
export const FORMAT_PAYMENT_TOKEN_TO_FIXED_DEFAULT = 3
export const FORMAT_NATIVE_TOKEN_TO_FIXED_DEFAULT = 6
