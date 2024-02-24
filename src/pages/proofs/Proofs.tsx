import React from 'react'
import styled from '@emotion/styled'
import { ProofsFilters } from '@fluencelabs/deal-aurora/dist/dealExplorerClient/types/filters'

import { Search } from '../../components/Search'
import { Space } from '../../components/Space'
import { Text } from '../../components/Text'
import { useFilters } from '../../hooks/useFilters'

import { ProofsTable } from './ProofsTable'

export const Proofs: React.FC = () => {
  const [filters, setFilter] = useFilters<ProofsFilters>()

  return (
    <>
      <Header>
        <Text size={32}>List of proofs</Text>
        <FiltersBlock>
          <Search
            value={filters.search ?? ''}
            onChange={(search) => setFilter('search', search)}
            placeholder="Search by Tx / Provider ID / Peer ID"
          />
        </FiltersBlock>
      </Header>
      <Space height="64px" />
      <ProofsTable filters={filters} />
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
