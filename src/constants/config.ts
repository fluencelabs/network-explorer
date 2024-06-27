import { Chain, createClient } from 'viem'
import { createConfig, http } from 'wagmi'

// The network name for fluence contract clients: {kras, dar, stage, local}
export const FLUENCE_CLIENT_NETWORK =
  import.meta.env.VITE_FLUENCE_CLIENT_NETWORK ?? 'local'
export const BLOCKSCOUT_URL =
  import.meta.env.VITE_BLOCKSCOUT_URL ?? 'http://localhost:4000/'
export const RPC_URL = import.meta.env.VITE_RPC_URL ?? 'http://localhost:8545'
export const CHAIN_ID = parseInt(import.meta.env.VITE_CHAIN_ID ?? '0x1')

export const FILTER_ONLY_APPROVED_PROVIDERS_DEFAULT =
  import.meta.env.VITE_FILTER_ONLY_APPROVED_PROVIDERS_DEFAULT != undefined
    ? import.meta.env.VITE_FILTER_ONLY_APPROVED_PROVIDERS_DEFAULT == 'true'
    : true
export const FORMAT_PAYMENT_TOKEN_TO_FIXED_DEFAULT = 3
export const FORMAT_NATIVE_TOKEN_TO_FIXED_DEFAULT = 6

const CHAIN = {
  id: CHAIN_ID,
  name: FLUENCE_CLIENT_NETWORK,
  nativeCurrency: { name: 'FLT', symbol: 'FLT', decimals: 18 },
  rpcUrls: {
    default: RPC_URL,
  },
  blockExplorers: {
    default: BLOCKSCOUT_URL,
  },
} as const satisfies Chain

export const WAGMI_CONFIG = createConfig({
  chains: [CHAIN],
  client({ chain }) {
    return createClient({ chain, transport: http() })
  },
})
