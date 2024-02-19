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
  testnet: 'https://rpc.ankr.com/polygon_mumbai',
  stage: 'https://polygon.llamarpc.com',
  kras: 'https://rpc.ankr.com/polygon_mumbai',
  local: 'https://rpc.ankr.com/polygon_mumbai',
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
