import React from 'react'
import styled from '@emotion/styled'

import { PageHeader } from '../../components/PageHeader'
import { Search } from '../../components/Search'
import { Space } from '../../components/Space'
import { Switch } from '../../components/Switch'
import { Text } from '../../components/Text'
import { useFilters } from '../../hooks/useFilters'

import { ProvidersFilters } from '../../clients/dealExplorerClient/types/filters.ts'

import { ProviderTable } from './ProvidersTable'

export const Providers: React.FC = () => {
  const [filters, setFilters] = useFilters<ProvidersFilters>()

  return (
    <>
      <PageHeader>
        <Text size={32}>Compute provider list</Text>
        <FiltersBlock>
          <Search
            value={filters.search ?? ''}
            onChange={(value) => setFilters('search', value)}
            placeholder="Search by Address / Provider name"
          />
        </FiltersBlock>
      </PageHeader>
      <Space height="16px" />
      <Switch
        label="Approved providers"
        value={filters.onlyApproved ?? false}
        onSwitch={(value) =>
          setFilters('onlyApproved', !value ? undefined : true)
        }
      />
      <Space height="64px" />
      <ProviderTable filters={filters} />
    </>
  )
}

const FiltersBlock = styled.div`
  display: flex;
  gap: 16px;
`
