import React from 'react'
import styled from '@emotion/styled'
import { CapacityCommitmentsFilters } from '@fluencelabs/deal-aurora/dist/dealExplorerClient/types/filters'

import { Filters } from '../../components/Filters'
import { Search } from '../../components/Search'
import { Space } from '../../components/Space'
import { Text } from '../../components/Text'
import { useFilters } from '../../hooks/useFilters'

import { CapacitiesFilterModal } from './CapacitiesFilterModal'
import { CapacitiesTable } from './CapacitiesTable'

export const Capacities: React.FC = () => {
  const [filters, setFilter, resetFilters] =
    useFilters<CapacityCommitmentsFilters>()

  return (
    <>
      <Header>
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
      </Header>
      <Space height="68px" />
      <CapacitiesTable filters={filters} />
    </>
  )
}

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
`

const FiltersBlock = styled.div`
  display: flex;
  gap: 16px;
`
