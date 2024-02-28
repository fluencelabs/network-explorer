import { ContractsENV } from '@fluencelabs/deal-aurora'
import { configureChains, createConfig } from 'wagmi'
import { jsonRpcProvider } from 'wagmi/providers/jsonRpc'

import { type ChainId, RPC, SUPPORTED_CHAINS } from '.'

export const SUBGRAPH_URL: Record<ContractsENV, string> = {
  testnet:
    'https://api.thegraph.com/subgraphs/name/alcibiadescleinias/fluence-deal-contracts',
  stage:
    'https://api.thegraph.com/subgraphs/name/alcibiadescleinias/fluence-deal-contracts',
  kras: 'https://api.thegraph.com/subgraphs/name/alcibiadescleinias/fluence-deal-contracts',
  local:
    'https://api.thegraph.com/subgraphs/name/alcibiadescleinias/fluence-deal-contracts',
}

export const RPC_URL: Record<ContractsENV, string> = {
  dar: 'https://ipc-dar.fluence.dev/',
  stage: 'https://ipc-stage.fluence.dev/',
  kras: 'https://rpc.ankr.com/polygon_mumbai',
  local: 'https://rpc.ankr.com/polygon_mumbai',
}

export const BLOCKSCOUT_URL: Record<ContractsENV, string> = {
  dar: 'https://blockscout-dar.fluence.dev',
  stage: 'https://blockscout-stage.fluence.dev/',
  kras: 'https://blockscout-kras.fluence.dev',
  local: 'http://localhost:4000/',
}

const { publicClient, webSocketPublicClient } = configureChains(
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
