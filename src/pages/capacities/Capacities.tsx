import React from 'react'
import styled from '@emotion/styled'

import { Filters } from '../../components/Filters'
import { PageHeader } from '../../components/PageHeader'
import { Search } from '../../components/Search'
import { Space } from '../../components/Space'
import { Text } from '../../components/Text'
import { useFilters } from '../../hooks/useFilters'

import { CapacityCommitmentsFilters } from '../../clients/dealExplorerClient/types/filters.ts'

import { CapacitiesFilterModal } from './CapacitiesFilterModal'
import { CapacitiesTable } from './CapacitiesTable'

export const Capacities: React.FC = () => {
  const [filters, setFilter, resetFilters] =
    useFilters<CapacityCommitmentsFilters>()

  return (
    <>
      <PageHeader>
        <Text size={32}>List of capacity</Text>
        <FiltersBlock>
          <Filters>
            <CapacitiesFilterModal
              filters={filters}
              setFilter={setFilter}
              resetFilters={resetFilters}
            />
          </Filters>
          <Search
            value={filters.search ?? ''}
            onChange={(search) => setFilter('search', search)}
            placeholder="Search by Provider ID / Commitment ID / Peer ID / Delegator"
          />
        </FiltersBlock>
      </PageHeader>
      <Space height="68px" />
      <CapacitiesTable filters={filters} />
    </>
  )
}

const FiltersBlock = styled.div`
  display: flex;
  gap: 16px;
`
