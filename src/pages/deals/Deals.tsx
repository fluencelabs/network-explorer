import React from 'react'
import styled from '@emotion/styled'
import { DealsFilters } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/filters'
import { DealStatus } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/schemes'

import { ButtonGroup } from '../../components/ButtonGroup'
import { Filters } from '../../components/Filters'
import { PageHeader } from '../../components/PageHeader'
import { Search } from '../../components/Search'
import { Space } from '../../components/Space'
import { Text } from '../../components/Text'
import { usePagination } from '../../hooks'
import { useFilters } from '../../hooks/useFilters'

import { DealsFilterModal } from './DealsFilterModal'
import { DEALS_PER_PAGE, DealsTable } from './DealsTable'

const items: { value: DealStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'insufficientFunds', label: 'Insufficient Funds' },
  { value: 'notEnoughWorkers', label: 'Not Enough Workers' },
  { value: 'smallBalance', label: 'Small Balance' },
]

export const Deals: React.FC = () => {
  const [filters, setFilter, resetFilters] = useFilters<DealsFilters>()
  const pagination = usePagination(DEALS_PER_PAGE)
  const { selectPage } = pagination

  return (
    <>
      <PageHeader>
        <Text size={32}>List of deals</Text>
        <FiltersBlock>
          <Filters selectedCount={Object.keys(filters).length}>
            <DealsFilterModal
              filters={filters}
              setFilter={setFilter}
              resetFilters={resetFilters}
            />
          </Filters>
          <Search
            value={filters.search ?? ''}
            onChange={(search) => setFilter('search', search)}
            placeholder="Search by Deal / Client ID"
          />
        </FiltersBlock>
      </PageHeader>
      <Space height="28px" />
      <ButtonGroup
        value={filters.status ?? 'all'}
        onSelect={(status) => {
          setFilter('status', status === 'all' ? undefined : status)
          selectPage(1)
        }}
        items={items}
      />
      <Space height="40px" />
      <DealsTable filters={filters} pagination={pagination} />
    </>
  )
}

const FiltersBlock = styled.div`
  display: flex;
  gap: 16px;
`
