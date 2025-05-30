import {
  BLOCK_SCOUT_URLS,
  CHAIN_IDS,
  ContractsENV,
  DEPLOYMENTS,
  RPC_URLS,
  SUBGRAPH_URLS,
} from '@fluencelabs/deal-ts-clients'
import { GraphQLClient } from 'graphql-request'
import { Chain } from 'viem'
import { createConfig, createStorage, http } from 'wagmi'

// The network name for fluence contract clients: {kras, dar, stage, local}
export const FLUENCE_CLIENT_NETWORK: ContractsENV =
  import.meta.env.VITE_FLUENCE_CLIENT_NETWORK ?? 'local'
export const BLOCKSCOUT_URL =
  import.meta.env.VITE_BLOCKSCOUT_URL || FLUENCE_CLIENT_NETWORK === 'local'
    ? import.meta.env.VITE_BLOCKSCOUT_URL
    : BLOCK_SCOUT_URLS[FLUENCE_CLIENT_NETWORK]
export const RPC_URL =
  import.meta.env.VITE_RPC_URL ?? RPC_URLS[FLUENCE_CLIENT_NETWORK]
export const CHAIN_ID = parseInt(
  import.meta.env.VITE_CHAIN_ID ?? `${CHAIN_IDS[FLUENCE_CLIENT_NETWORK]}`,
)
export const FILTER_ONLY_APPROVED_PROVIDERS_DEFAULT =
  import.meta.env.VITE_FILTER_ONLY_APPROVED_PROVIDERS_DEFAULT != undefined
    ? import.meta.env.VITE_FILTER_ONLY_APPROVED_PROVIDERS_DEFAULT == 'true'
    : true
export const FORMAT_PAYMENT_TOKEN_TO_FIXED_DEFAULT = 3
export const FORMAT_NATIVE_TOKEN_TO_FIXED_DEFAULT = 6

export const SUBGRAPH_URL =
  import.meta.env.VITE_SUBGRAPH_URL ?? SUBGRAPH_URLS[FLUENCE_CLIENT_NETWORK]
export const graphQLClient = new GraphQLClient(SUBGRAPH_URL)
export const DEPLOYMENT = DEPLOYMENTS[FLUENCE_CLIENT_NETWORK]

export const CHAIN = {
  id: CHAIN_ID,
  name: FLUENCE_CLIENT_NETWORK,
  nativeCurrency: { name: 'FLT', symbol: 'FLT', decimals: 18 },
  rpcUrls: {
    default: RPC_URL,
  },
  ...(BLOCKSCOUT_URL === null
    ? {}
    : {
        blockExplorers: {
          default: {
            name: 'BlockScout',
            url: BLOCKSCOUT_URL,
          },
        },
      }),
} as const satisfies Chain

const storage = createStorage({
  storage: localStorage,
  key: FLUENCE_CLIENT_NETWORK,
})

export const WAGMI_CONFIG = createConfig({
  chains: [CHAIN],
  transports: {
    [CHAIN_ID]: http(RPC_URL),
  },
  storage,
})
