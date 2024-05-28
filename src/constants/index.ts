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
