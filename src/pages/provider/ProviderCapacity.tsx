import React from 'react'
import { useParams } from 'wouter'

import { InfoLoader } from '../../components/InfoLoader'
import { NotFound } from '../../components/NotFound'
import { Space } from '../../components/Space'
import { useApiQuery } from '../../hooks'

import { ROUTES } from '../../constants'

import { Provider } from './Provider'
import { ProviderCapacityTable } from './ProviderCapacityTable'

export const ProviderCapacity: React.FC = () => {
  const params = useParams()

  const { id } = params

  const { data: provider, isLoading } = useApiQuery(
    ['getProvider', JSON.stringify({ id })],
    (client) => client.getProvider(id ?? ''),
  )

  if (isLoading) {
    return <InfoLoader />
  }

  if (!provider || !id) {
    return (
      <NotFound
        message="Not found provider"
        link={ROUTES.providers}
        linkText="Go to providers page"
      />
    )
  }

  return (
    <Provider provider={provider}>
      <Space height="44px" />
      <ProviderCapacityTable providerId={provider.id} />
    </Provider>
  )
}
