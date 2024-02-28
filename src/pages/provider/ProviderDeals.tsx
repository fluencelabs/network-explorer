import React from 'react'
import { useParams } from 'wouter'

import { Space } from '../../components/Space'
import { useApiQuery } from '../../hooks'

import { Provider } from './Provider'
import { ProviderDealsTable } from './ProviderDealsTable'

export const ProviderDeals: React.FC = () => {
  const params = useParams()

  const { id } = params

  const { data: provider } = useApiQuery((client) =>
    client.getProvider(id ?? ''),
  )

  if (!provider) {
    return
  }

  return (
    <Provider provider={provider}>
      <Space height="44px" />
      <ProviderDealsTable providerId={provider.id} />
    </Provider>
  )
}
