import { polygonMumbai } from 'wagmi/chains'

export enum ChainId {
  MUMBAI = 80001,
}

export const SUPPORTED_CHAINS = [polygonMumbai]

export const RPC: Record<ChainId, string> = {
  [ChainId.MUMBAI]: 'https://polygon-mumbai.gateway.tenderly.co',
}

export const ROUTES = {
  providers: '/',
  providerInfo: '/provider/:id',
  providerOffers: '/provider/:id/offers',
  providerDeals: '/provider/:id/deals',
  providerCapacity: '/provider/:id/capacity',
  offers: '/offers',
  offerInfo: '/offer/:id',
  deals: '/deals',
  dealInfo: '/deal/:id',
  capacities: '/capacities',
  capacityInfo: '/capacity/:id',
  proofs: '/proofs',
  peerInfo: '/peer/:id',
  computeUnitInfo: '/compute-unit/:id',
} as const

export type Routes = typeof ROUTES
