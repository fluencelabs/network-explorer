import React from 'react'
import styled from '@emotion/styled'
import { CapacityCommitmentsFilters } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/filters'
import { CapacityCommitmentStatus } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/schemes'

import { Filters } from '../../components/Filters'
import { PageHeader } from '../../components/PageHeader'
import { Search } from '../../components/Search'
import { SelectStatus } from '../../components/SelectStatus'
import { Space } from '../../components/Space'
import { Text } from '../../components/Text'
import { useFilters } from '../../hooks/useFilters'

import { CapacitiesFilterModal } from './CapacitiesFilterModal'
import { CapacitiesTable } from './CapacitiesTable'

export const Capacities: React.FC = () => {
  const [filters, setFilter, resetFilters] =
    useFilters<CapacityCommitmentsFilters>()

  const handleSetStatus = (value: CapacityCommitmentStatus | 'all') => {
    const filter = value === 'all' || value === 'undefined' ? undefined : value
    setFilter('status', filter)
  }

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
            placeholder="Search by Provider ID / Commitment ID / Peer ID / Staker"
          />
        </FiltersBlock>
      </PageHeader>
      <Space height="24px" />
      <SelectStatus value={filters.status} onChange={handleSetStatus} />
      <Space height="32px" />
      <CapacitiesTable filters={filters} />
    </>
  )
}

const FiltersBlock = styled.div`
  display: flex;
  gap: 16px;
`
