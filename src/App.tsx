import React from 'react'
import { Route } from 'wouter'

import { Layout } from './components/Layout'

import { Capacities } from './pages/capacities'
import { CapacityInfo } from './pages/capacity'
import { ComputeUnitInfo } from './pages/compute-unit'
import { ConfigJson } from './pages/config'
import { DataCenters } from './pages/data-centers'
import { DealInfo } from './pages/deal'
import { Deals } from './pages/deals'
import { OfferInfo } from './pages/offer'
import { Offers } from './pages/offers'
import { PeerInfo } from './pages/peer'
import {
  ProviderDeals,
  ProviderInfo,
  ProviderOffers,
  ProviderPeers,
} from './pages/provider'
import { ProviderCapacity } from './pages/provider/ProviderCapacity'
import { Providers } from './pages/providers'
import { Resources } from './pages/resources'
import { ROUTES } from './constants'

import 'react-loading-skeleton/dist/skeleton.css'
import 'normalize.css'
import './App.css'

export const App: React.FC = () => {
  return (
    <Layout>
      <Route path={ROUTES.providers} component={Providers} />
      <Route path={ROUTES.providerInfo} component={ProviderInfo} />
      <Route path={ROUTES.providerOffers} component={ProviderOffers} />
      <Route path={ROUTES.providerPeers} component={ProviderPeers} />
      <Route path={ROUTES.providerDeals} component={ProviderDeals} />
      <Route path={ROUTES.providerCapacity} component={ProviderCapacity} />
      <Route path={ROUTES.offers} component={Offers} />
      <Route path={ROUTES.offerInfo} component={OfferInfo} />
      <Route path={ROUTES.deals} component={Deals} />
      <Route path={ROUTES.dataCenters} component={DataCenters} />
      <Route path={ROUTES.resources} component={Resources} />
      <Route path={ROUTES.dealInfo} component={DealInfo} />
      <Route path={ROUTES.capacities} component={Capacities} />
      <Route path={ROUTES.capacityInfo} component={CapacityInfo} />
      <Route path={ROUTES.peerInfo} component={PeerInfo} />
      <Route path={ROUTES.computeUnitInfo} component={ComputeUnitInfo} />
      <Route path={ROUTES.config} component={ConfigJson} />
    </Layout>
  )
}
