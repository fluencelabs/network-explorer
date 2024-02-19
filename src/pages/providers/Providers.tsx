import React from 'react'
import styled from '@emotion/styled'
import { ProvidersFilters } from '@fluencelabs/deal-aurora/dist/dealExplorerClient/types/filters'

import { Search } from '../../components/Search'
import { Space } from '../../components/Space'
import { Switch } from '../../components/Switch'
import { Text } from '../../components/Text'
import { useFilters } from '../../hooks/useFilters'

import { ProviderTable } from './ProvidersTable'

export const Providers: React.FC = () => {
  const [filters, setFilters] = useFilters<ProvidersFilters>()

  return (
    <>
      <Header>
        <Text size={32}>Compute provider list</Text>
        <FiltersBlock>
          <Search
            value={filters.search ?? ''}
            onChange={(value) => setFilters('search', value)}
            placeholder="Search by Address / Provider name"
          />
        </FiltersBlock>
      </Header>
      <Space height="16px" />
      <Switch
        label="Approved providers"
        value={filters.onlyApproved ?? false}
        onSwitch={(value) =>
          setFilters('onlyApproved', !value ? undefined : true)
        }
      />
      <Space height="64px" />
      <ProviderTable filters={filters} />
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
