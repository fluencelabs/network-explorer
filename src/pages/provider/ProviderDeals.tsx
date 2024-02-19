import React, { useState } from 'react'
import { useParams } from 'wouter'

import { ButtonGroup } from '../../components/ButtonGroup'
import { Space } from '../../components/Space'
import { Text } from '../../components/Text'
import { useApiQuery } from '../../hooks'

import { Provider } from './Provider'
import { ProviderDealsTable } from './ProviderDealsTable'

const items = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

export const ProviderDeals: React.FC = () => {
  const [value, setValue] = useState(items[0].value)

  const params = useParams()

  const { id } = params

  const { data: provider } = useApiQuery((client) => client.getProvider(id))

  if (!provider) {
    return
  }

  return (
    <Provider provider={provider}>
      <Space height="44px" />
      <Text size={32}>Deals</Text>
      <Space height="24px" />
      <ButtonGroup value={value} onSelect={setValue} items={items} />
      <Space height="40px" />
      <ProviderDealsTable providerId={provider.id} />
    </Provider>
  )
}
