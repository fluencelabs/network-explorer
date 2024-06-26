import React from 'react'
import styled from '@emotion/styled'
import { ProofsFilters } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/filters'

import { PageHeader } from '../../components/PageHeader'
import { Search } from '../../components/Search'
import { Space } from '../../components/Space'
import { Text } from '../../components/Text'
import { useFilters } from '../../hooks/useFilters'

import { ProofsTable } from './ProofsTable'

export const Proofs: React.FC = () => {
  const [filters, setFilter] = useFilters<ProofsFilters>()

  return (
    <>
      <PageHeader>
        <Text size={32}>List of proofs</Text>
        <FiltersBlock>
          <Search
            value={filters.search ?? ''}
            onChange={(search) => setFilter('search', search)}
            placeholder="Search by Tx / Provider ID / Peer ID"
          />
        </FiltersBlock>
      </PageHeader>
      <Space height="64px" />
      <ProofsTable filters={filters} />
    </>
  )
}

const FiltersBlock = styled.div`
  display: flex;
  gap: 16px;
`
