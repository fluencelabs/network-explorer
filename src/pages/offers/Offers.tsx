import React from 'react'
import styled from '@emotion/styled'
import { OffersFilters } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/filters'

import { Filters } from '../../components/Filters'
import { PageHeader } from '../../components/PageHeader'
import { Search } from '../../components/Search'
import { Space } from '../../components/Space'
import { Switch } from '../../components/Switch'
import { Text } from '../../components/Text'
import { useFilters } from '../../hooks/useFilters'

import { FILTER_ONLY_APPROVED_PROVIDERS_DEFAULT } from '../../constants/config.ts'

import { OffersFilterModal } from './OffersFilterModal'
import { OffersTable } from './OffersTable'

export const Offers: React.FC = () => {
  const [filters, setFilter, resetFilters] = useFilters<OffersFilters>()

  // Set default value for onlyApproved filter.
  if (filters.onlyApproved == undefined) {
    setFilter('onlyApproved', FILTER_ONLY_APPROVED_PROVIDERS_DEFAULT)
  }

  return (
    <>
      <PageHeader>
        <Text size={32}>List of offers</Text>
        <FiltersBlock>
          <Filters>
            <OffersFilterModal
              filters={filters}
              setFilter={setFilter}
              resetFilters={resetFilters}
            />
          </Filters>
          <Search
            value={filters.search ?? ''}
            onChange={(search) => setFilter('search', search)}
            placeholder="Search by Offer ID / Provider ID"
          />
        </FiltersBlock>
      </PageHeader>
      <Space height="16px" />
      <Switch
        label="Offers from approved providers"
        value={
          filters.onlyApproved === undefined
            ? FILTER_ONLY_APPROVED_PROVIDERS_DEFAULT
            : filters.onlyApproved
        }
        onSwitch={(value) => setFilter('onlyApproved', value)}
      />
      <Space height="64px" />
      <OffersTable filters={filters} />
    </>
  )
}

const FiltersBlock = styled.div`
  display: flex;
  gap: 16px;
`
