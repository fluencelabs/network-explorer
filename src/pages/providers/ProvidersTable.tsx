import React, { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from '@emotion/styled'
import {
  OrderType,
  ProvidersFilters,
  ProviderShortOrderBy,
} from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/filters'
import { ProviderListEntry } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/schemes'
import { useLocation } from 'wouter'

import { ApprovedIcon, ArrowIcon, InfoOutlineIcon } from '../../assets/icons'
import ProviderYellow from '../../assets/providers/yellow.png'
import { A } from '../../components/A'
import { Pagination } from '../../components/Pagination'
import { Space } from '../../components/Space'
import {
  Cell,
  HeaderCellWithTooltip,
  Row,
  RowBlock,
  ScrollableTable,
  TableBody,
  TableColumnTitle,
  TableColumnTitleWithSort,
  TableHeader,
  TablePagination,
} from '../../components/Table'
import { Text } from '../../components/Text'
import { Tooltip } from '../../components/Tooltip'
import { usePagination } from '../../hooks'
import { useApiQuery } from '../../hooks/useApiQuery'

import { colors } from '../../constants/colors'

const template = [
  'minmax(150px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(100px, 1fr)',
  'minmax(50px, 1fr)',
  '60px',
]

interface ProviderRowProps {
  provider: ProviderListEntry
}

type ProviderSort = `${ProviderShortOrderBy}:${OrderType}`

interface ProviderTableProps {
  filters: ProvidersFilters
}

const PROVIDERS_PER_PAGE = 15

export const ProviderTable: React.FC<ProviderTableProps> = ({ filters }) => {
  const [order, setOrder] = useState<ProviderSort>('createdAt:desc')
  const [orderBy, orderType] = order.split(':') as [
    ProviderShortOrderBy,
    OrderType,
  ]

  const { page, selectPage, limit, offset, getTotalPages } =
    usePagination(PROVIDERS_PER_PAGE)

  const { data: providers, isLoading } = useApiQuery(
    (client) =>
      client.getProviders(filters, offset, limit + 1, orderBy, orderType),
    [page, orderBy, orderType, filters],
    {
      key: `providers:${JSON.stringify({
        filters,
        offset,
        limit,
        order,
        orderBy,
      })}`,
      ttl: 1_000 * 60, // 1 minute
    },
  )

  const hasNextPage = providers && providers.data.length > limit
  const pageProviders = providers && providers.data.slice(0, limit)

  const handleSort = (key: ProviderShortOrderBy, order: OrderType) => {
    setOrder(`${key}:${order}`)
  }

  return (
    <>
      <ScrollableTable>
        <TableHeader template={template}>
          <TableColumnTitle>Provider name</TableColumnTitle>
          <TableColumnTitle>Provider Address</TableColumnTitle>
          <TableColumnTitle>Peers</TableColumnTitle>
          <TableColumnTitleWithSort
            order={orderType}
            field="computeUnitsTotal"
            isActive={orderBy === 'computeUnitsTotal'}
            onSort={handleSort}
          >
            Compute Units{' '}
            <Text size={10} weight={500} color="green" uppercase>
              ( Available )
            </Text>
          </TableColumnTitleWithSort>
          <HeaderCellWithTooltip>
            <TableColumnTitle>Approved</TableColumnTitle>
            <Tooltip trigger={<InfoOutlineIcon />}>
              <Text color="grey600" weight={600} size={12}>
                DAO Approved Providers
              </Text>
            </Tooltip>
          </HeaderCellWithTooltip>
        </TableHeader>
        <TableBody
          skeletonCount={PROVIDERS_PER_PAGE}
          skeletonHeight={40}
          isLoading={isLoading}
        >
          {pageProviders?.map((provider) => (
            <ProviderRow key={provider.id} provider={provider} />
          ))}
        </TableBody>
      </ScrollableTable>
      <Space height="32px" />
      <TablePagination>
        {!providers ? (
          <Skeleton width={200} height={34} count={1} />
        ) : (
          <Pagination
            pages={getTotalPages(providers.total)}
            page={page}
            hasNextPage={hasNextPage}
            onSelect={selectPage}
          />
        )}
      </TablePagination>
    </>
  )
}

const ProviderRow: React.FC<ProviderRowProps> = ({ provider }) => {
  const [, navigate] = useLocation()

  return (
    <RowBlock>
      <RowHeader onClick={() => navigate(`/provider/${provider.id}`)}>
        <Row template={template}>
          <Cell>
            <ImgStyled src={ProviderYellow} />
            <Space width="8px" />
            <Text size={14}>{provider.name}</Text>
          </Cell>
          <Cell>
            <A href={`/provider/${provider.id}`}>{provider.id}</A>
          </Cell>
          <Cell>
            <Text size={12}>{provider.peersTotal}</Text>
          </Cell>
          <Cell>
            <Text size={12}>{provider.computeUnitsTotal}</Text>
            <Space width="6px" />
            <ProviderComputeUnitsAvailable size={12} color="white">
              {provider.computeUnitsInCapacityCommitment}
            </ProviderComputeUnitsAvailable>
          </Cell>
          <Cell>{provider.isApproved ? <ApprovedIcon /> : <>-</>}</Cell>
        </Row>
      </RowHeader>
    </RowBlock>
  )
}

const ArrowIconStyled = styled(ArrowIcon)`
  transition: transform 200ms;
`

const RowHeader = styled.div`
  width: 100%;
  cursor: pointer;
  padding: 8px 12px;

  &[data-state='open'] {
    ${ArrowIconStyled} {
      transform: rotate(-90deg);
    }
  }
`

const ProviderComputeUnitsAvailable = styled(Text)`
  background-color: ${colors.green};
  padding: 1px 6px;
  border-radius: 100px;
`

const ImgStyled = styled.img`
  height: 24px;
  width: 24px;
`
