import React, { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from '@emotion/styled'
import { useLocation } from 'wouter'

import { InfoOutlineIcon } from '../../assets/icons'
import { A } from '../../components/A'
import { ButtonGroup } from '../../components/ButtonGroup'
import { CapacityStatus } from '../../components/CapacityStatus'
import { DetailsButton } from '../../components/DetailsButton'
import { Pagination } from '../../components/Pagination'
import { Space } from '../../components/Space'
import {
  Cell,
  HeaderCellWithTooltip,
  Row,
  RowBlock,
  RowHeader,
  RowTrigger,
  ScrollableTable,
  TableBody,
  TableColumnTitle,
  TableColumnTitleWithSort,
  TableHeader,
  TablePagination,
} from '../../components/Table'
import { ShrinkText, Text } from '../../components/Text'
import { Tooltip } from '../../components/Tooltip'
import { useApiQuery, usePagination } from '../../hooks'
import { useFilters } from '../../hooks/useFilters'
import { formatUnixTimestamp } from '../../utils/formatUnixTimestamp'

import {
  CapacityCommitmentsOrderBy,
  ChildEntitiesByProviderFilter,
  OrderType,
  ProviderChildEntityStatusFilter,
} from '../../client/types/filters'
import { CapacityCommitmentShort } from '../../client/types/schemes.ts'

const template = [
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(50px, 1fr)',
  '70px',
]

interface ProviderCapacityTableProps {
  providerId: string
}

const PROVIDER_CAPACITIES_PER_PAGE = 5

type ProviderCapacitySort = `${CapacityCommitmentsOrderBy}:${OrderType}`

const items: {
  value: ProviderChildEntityStatusFilter | 'all'
  label: string
}[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

export const ProviderCapacityTable: React.FC<ProviderCapacityTableProps> = ({
  providerId,
}) => {
  const [filters, setFilter] = useFilters<ChildEntitiesByProviderFilter>({
    providerId,
  })

  const [order, setOrder] = useState<ProviderCapacitySort>('createdAt:desc')
  const [orderBy, orderType] = order.split(':') as [
    CapacityCommitmentsOrderBy,
    OrderType,
  ]

  const { page, selectPage, limit, offset, getTotalPages } = usePagination(
    PROVIDER_CAPACITIES_PER_PAGE,
  )

  const { data: capacities, isLoading } = useApiQuery(
    (client) =>
      client.getCapacityCommitmentsByProvider(
        filters,
        offset,
        limit + 1,
        orderBy,
        orderType,
      ),
    [page, orderBy, orderType, filters],
    {
      key: `provider-capacities:${JSON.stringify({
        filters,
        offset,
        limit,
        order,
        orderBy,
      })}`,
      ttl: 1_000 * 60, // 1 minute
    },
  )

  const hasNextPage = capacities && capacities.data.length > limit
  const pageCapacities = capacities && capacities.data.slice(0, limit)

  const handleSort = (key: CapacityCommitmentsOrderBy, order: OrderType) => {
    setOrder(`${key}:${order}`)
  }

  const handleSetStatus = (value: ProviderChildEntityStatusFilter) => {
    setFilter('status', value)
  }

  return (
    <>
      <Text size={32}>Capacity commitments</Text>
      <Space height="24px" />
      <ButtonGroup
        value={filters.status ?? 'all'}
        onSelect={handleSetStatus}
        items={items}
      />
      <Space height="32px" />
      <ScrollableTable>
        <TableHeader template={template}>
          <TableColumnTitle>
            <TableColumnTitle>Commitment Id</TableColumnTitle>
          </TableColumnTitle>
          <TableColumnTitleWithSort
            order={orderType}
            field="createdAt"
            isActive={orderBy === 'createdAt'}
            onSort={handleSort}
          >
            Created At
          </TableColumnTitleWithSort>
          <TableColumnTitle>Duration</TableColumnTitle>
          <TableColumnTitleWithSort
            order={orderType}
            field="expirationAt"
            isActive={orderBy === 'expirationAt'}
            onSort={handleSort}
          >
            Expiration
          </TableColumnTitleWithSort>
          <HeaderCellWithTooltip>
            <TableColumnTitle>Peer Id</TableColumnTitle>
            <Tooltip trigger={<InfoOutlineIcon />}>
              <Text color="grey600" weight={600}>
                Peer tied to the capacity commitment
              </Text>
            </Tooltip>
          </HeaderCellWithTooltip>
          <TableColumnTitleWithSort
            order={orderType}
            field="computeUnitsCount"
            isActive={orderBy === 'computeUnitsCount'}
            onSort={handleSort}
          >
            Compute units
          </TableColumnTitleWithSort>
          <TableColumnTitle>Delegate Rate</TableColumnTitle>
          <TableColumnTitle>Status</TableColumnTitle>
        </TableHeader>
        <TableBody
          skeletonCount={PROVIDER_CAPACITIES_PER_PAGE}
          isLoading={isLoading}
        >
          {pageCapacities?.map((capacity) => (
            <CapacityRow key={capacity.id} capacity={capacity} />
          ))}
        </TableBody>
      </ScrollableTable>
      <Space height="32px" />
      <TablePagination>
        {!capacities ? (
          <Skeleton width={200} height={34} count={1} />
        ) : (
          <Pagination
            pages={getTotalPages(capacities.total)}
            page={page}
            hasNextPage={hasNextPage}
            onSelect={selectPage}
          />
        )}
      </TablePagination>
    </>
  )
}

interface CapacityRowProps {
  capacity: CapacityCommitmentShort
}

const CapacityRow: React.FC<CapacityRowProps> = ({ capacity }) => {
  const [, navigate] = useLocation()

  const createdAt = formatUnixTimestamp(capacity.createdAt)
  const expiredAt = capacity.expiredAt
    ? formatUnixTimestamp(capacity.expiredAt)
    : { date: '-', time: '' }

  return (
    <RowBlock>
      <RowHeader>
        <RowTrigger>
          <Row template={template}>
            {/* Commitment Id */}
            <Cell>
              <A href={`/capacity/${capacity.id}`}>{capacity.id}</A>
            </Cell>
            {/* # Created At */}
            <Cell>
              <Column>
                <Text size={12}>{createdAt.date}</Text>
                <Text size={12}>{createdAt.time}</Text>
              </Column>
            </Cell>
            {/* Duration */}
            <Cell>
              <Column>
                <Text size={12}>{capacity.duration}</Text>
              </Column>
            </Cell>
            {/* Expiration */}
            <Cell>
              <Column>
                <Text size={12}>{expiredAt.date}</Text>
                <Text size={12}>{expiredAt.time}</Text>
              </Column>
            </Cell>
            {/* Peer Id */}
            <Cell>
              <ShrinkText size={12}>
                <A href={`/peer/${capacity.peerId}`}>{capacity.peerId}</A>
              </ShrinkText>
            </Cell>
            {/* Compute Units */}
            <Cell>
              <Text size={12}>{capacity.computeUnitsCount}</Text>
            </Cell>
            {/* Delegate Rate */}
            <Cell>
              <Text size={12}>{capacity.rewardDelegatorRate.toFixed(2)}%</Text>
            </Cell>
            {/* Status */}
            <Cell>
              <CapacityStatus status={capacity.status} />
            </Cell>
            <Cell>
              <DetailsButton
                onClick={() => navigate(`/capacity/${capacity.id}`)}
              >
                <Text size={10} weight={800} uppercase>
                  Details
                </Text>
              </DetailsButton>
            </Cell>
          </Row>
        </RowTrigger>
      </RowHeader>
    </RowBlock>
  )
}

const Column = styled.div`
  display: flex;
  flex-direction: column;
`
