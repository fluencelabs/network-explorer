import React, { useState } from 'react'
import styled from '@emotion/styled'

import { Search } from '../../components/Search'
import { Sort } from '../../components/Sort'
import { Space } from '../../components/Space'
import { Text } from '../../components/Text'

import { ProofsTable } from './ProofsTable'

export const Proofs: React.FC = () => {
  const [search, setSearch] = useState('')

  return (
    <>
      <Header>
        <Text size={32}>List of proofs</Text>
        <FiltersBlock>
          <Search
            value={search}
            onChange={setSearch}
            placeholder="Search by Tx / Provider ID / Peer ID"
          />
          <Sort
            items={[
              {
                label: 'Newest',
                value: 'newest',
              },
              {
                label: 'Oldest',
                value: 'oldest',
              },
              {
                label: 'Compute units',
                value: 'units',
              },
            ]}
            value="newest"
            setValue={() => null}
          />
        </FiltersBlock>
      </Header>
      <Space height="64px" />
      <ProofsTable />
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
