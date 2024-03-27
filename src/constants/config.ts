import { ContractsENV } from '@fluencelabs/deal-ts-clients'
import { configureChains, createConfig } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

import { type ChainId, RPC, SUPPORTED_CHAINS } from '.'

export const ADD_LOCAL_NETWORK = ['true', 'True', 1, '1'].includes(
  import.meta.env.VITE_ADD_LOCAL_NETWORK,
)

export const RPC_URL: Record<ContractsENV, string> = {
  dar: 'https://ipc-dar.fluence.dev/',
  stage: 'https://ipc-stage.fluence.dev/',
  kras: 'https://ipc.kras.fluence.dev/',
  local: 'http://0.0.0.0:8545/',
}

export const BLOCKSCOUT_URL: Record<ContractsENV, string> = {
  dar: 'https://blockscout-dar.fluence.dev/',
  stage: 'https://blockscout-stage.fluence.dev/',
  kras: 'https://blockscout.kras.fluence.dev/',
  local: 'http://localhost:4000/',
}

const { publicClient, webSocketPublicClient } = configureChains(
  // TODO: what is supported chains? it consists only of polygonMumbai for now.
  SUPPORTED_CHAINS,
  [
    jsonRpcProvider({
      rpc: (chain) => ({
        http: RPC[chain.id as ChainId],
      }),
    }),
  ],
)

export const WAGMI_CONFIG = createConfig({
  publicClient,
  webSocketPublicClient,
})

export const CONTRACTS_PRECISION = 10_000_000
