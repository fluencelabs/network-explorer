import React from 'react'
import styled from '@emotion/styled'
import { ProvidersFilters } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/filters'

import { PageHeader } from '../../components/PageHeader'
import { Search } from '../../components/Search'
import { Space } from '../../components/Space'
import { Switch } from '../../components/Switch'
import { Text } from '../../components/Text'
import { useFilters } from '../../hooks/useFilters'

import { FILTER_ONLY_APPROVED_PROVIDERS_DEFAULT } from '../../constants/config.ts'

import { ProviderTable } from './ProvidersTable'

export const Providers: React.FC = () => {
  const [filters, setFilters] = useFilters<ProvidersFilters>()

  // Set default value for onlyApproved filter.
  if (filters.onlyApproved == undefined) {
    setFilters('onlyApproved', FILTER_ONLY_APPROVED_PROVIDERS_DEFAULT)
  }

  return (
    <>
      <PageHeader>
        <Text size={32}>Compute provider list</Text>
        <FiltersBlock>
          <Search
            value={filters.search ?? ''}
            onChange={(value) => setFilters('search', value)}
            placeholder="Search by Provider address / Provider name"
          />
        </FiltersBlock>
      </PageHeader>
      <Space height="16px" />
      <Switch
        label="Approved providers"
        value={
          filters.onlyApproved === undefined
            ? FILTER_ONLY_APPROVED_PROVIDERS_DEFAULT
            : filters.onlyApproved
        }
        onSwitch={(value) => setFilters('onlyApproved', value)}
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
