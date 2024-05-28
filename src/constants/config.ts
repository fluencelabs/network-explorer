import { getDefaultConfig } from '@rainbow-me/rainbowkit'
import { defineChain } from 'viem'

// import { SUPPORTED_CHAINS } from '.'
import { dar, kras } from './chains'

// export const ADD_LOCAL_NETWORK = ['true', 'True', 1, '1'].includes(
//   import.meta.env.VITE_ADD_LOCAL_NETWORK,
// )

const chainMap: Record<string, ReturnType<typeof defineChain>> = {
  dar,
  kras,
  // TODO add local network
}

export const CHAIN: typeof dar = chainMap[import.meta.env.VITE_CHAIN] ?? dar
export const CHAIN_NAME = CHAIN.name.toLowerCase()
export const BLOCKSCOUT_URL = CHAIN.blockExplorers.default.url
export const RPC_URL = CHAIN.rpcUrls.default.http[0]

export const WAGMI_CONFIG = getDefaultConfig({
  chains: [CHAIN],
  projectId: import.meta.env.VITE_WC_PROJECT_ID,
  appName: 'Fluence Network Explorer',
})

export const FILTER_ONLY_APPROVED_PROVIDERS_DEFAULT = true
export const FORMAT_PAYMENT_TOKEN_TO_FIXED_DEFAULT = 3
export const FORMAT_NATIVE_TOKEN_TO_FIXED_DEFAULT = 6
