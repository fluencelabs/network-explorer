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
import { useFilters } from '../../hooks/useFilters'

import { DealsFilterModal } from './DealsFilterModal'
import { DealsTable } from './DealsTable'

const items: { value: DealStatus | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'insufficientFunds', label: 'Insufficiet Funds' },
  { value: 'notEnoughWorkers', label: 'Not Enough Workers' },
  { value: 'smallBalance', label: 'Small Balance' },
]

export const Deals: React.FC = () => {
  const [filters, setFilter, resetFilters] = useFilters<DealsFilters>()

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
        onSelect={(status) =>
          setFilter('status', status === 'all' ? undefined : status)
        }
        items={items}
      />
      <Space height="40px" />
      <DealsTable filters={filters} />
    </>
  )
}

const FiltersBlock = styled.div`
  display: flex;
  gap: 16px;
`
