import React from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from '@emotion/styled'

import { A } from '../../components/A'
import { ButtonGroup } from '../../components/ButtonGroup'
import { CapacityStatus } from '../../components/CapacityStatus'
import { Pagination } from '../../components/Pagination'
import { Space } from '../../components/Space'
import {
  Cell,
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
import { Text } from '../../components/Text'
import { useApiQuery, useOrder, usePagination } from '../../hooks'
import { useFilters } from '../../hooks/useFilters'
import { formatUnixTimestamp } from '../../utils/formatUnixTimestamp'

import {
  CapacityCommitmentsOrderBy,
  ChildEntitiesByPeerFilter,
  ProviderChildEntityStatusFilter,
} from '../../clients/dealExplorerClient/types/filters'
import { CapacityCommitmentShort } from '../../clients/dealExplorerClient/types/schemes.ts'

const template = [
  '30px',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  '100px',
]

const items: {
  value: ProviderChildEntityStatusFilter
  label: string
}[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

interface PeerCapacityCommitmentsTableProps {
  peerId: string
}

export const PeerCapacityCommitmentsTable: React.FC<
  PeerCapacityCommitmentsTableProps
> = ({ peerId }) => {
  const [filters, setFilter] = useFilters<ChildEntitiesByPeerFilter>({
    peerId,
  })

  const { orderBy, orderType, handleSort } =
    useOrder<CapacityCommitmentsOrderBy>('createdAt:desc')

  const { page, selectPage, limit, offset, getTotalPages, getPageItems } =
    usePagination(5)

  const { data: capacities, isLoading } = useApiQuery(
    (client) =>
      client.getCapacityCommitmentsByPeer(
        filters,
        offset,
        limit + 1,
        orderBy,
        orderType,
      ),
    [page, orderBy, orderType, filters],
    {
      key: `peer-capacities:${JSON.stringify({
        filters,
        offset,
        limit,
        orderBy,
        orderType,
      })}`,
      ttl: 1_000 * 60, // 1 minute
    },
  )

  const { hasNextPage, pageItems } = getPageItems(capacities?.data ?? [])

  return (
    <>
      <Text size={32}>Capacity commitments</Text>
      <Space height="24px" />
      <ButtonGroup
        value={filters.status ?? 'all'}
        onSelect={(value) => setFilter('status', value)}
        items={items}
      />
      <Space height="32px" />
      <ScrollableTable>
        <TableHeader template={template}>
          <TableColumnTitle>#</TableColumnTitle>
          <TableColumnTitle>Capacity commitment</TableColumnTitle>
          <TableColumnTitleWithSort
            order={orderType}
            field="createdAt"
            isActive={orderBy === 'createdAt'}
            onSort={handleSort}
          >
            Created At
          </TableColumnTitleWithSort>
          <TableColumnTitleWithSort
            order={orderType}
            field="expirationAt"
            isActive={orderBy === 'expirationAt'}
            onSort={handleSort}
          >
            Expiration
          </TableColumnTitleWithSort>
          <TableColumnTitle>Compute units</TableColumnTitle>
          <TableColumnTitle align="center">Status</TableColumnTitle>
        </TableHeader>
        <TableBody
          skeletonCount={limit}
          isLoading={isLoading}
          isEmpty={!pageItems.length}
        >
          {pageItems.map((capacity, index) => (
            <CapacityRow
              key={capacity.id}
              index={offset + index + 1}
              capacity={capacity}
            />
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
  index: number
  capacity: CapacityCommitmentShort
}

const CapacityRow: React.FC<CapacityRowProps> = ({ capacity, index }) => {
  const createdAt = formatUnixTimestamp(capacity.createdAt)
  const expiredAt = capacity.expiredAt
    ? formatUnixTimestamp(capacity.expiredAt)
    : { date: '-', time: '' }

  return (
    <RowBlock>
      <RowHeader>
        <RowTrigger>
          <Row template={template}>
            {/* # */}
            <Cell>
              <Text size={12}>{index}</Text>
            </Cell>
            {/* Capacity commitment */}
            <Cell>
              <A href={`/capacity/${capacity.id}`}>{capacity.id}</A>
            </Cell>
            {/* Created at */}
            <Cell>
              <Column>
                <Text size={12}>{createdAt.date}</Text>
                <Text size={12}>{createdAt.time}</Text>
              </Column>
            </Cell>
            {/* Expiration */}
            <Cell>
              <Column>
                <Text size={12}>{expiredAt.date}</Text>
                <Text size={12}>{expiredAt.time}</Text>
              </Column>
            </Cell>
            {/* Compute units */}
            <Cell>
              <Text size={12}>{capacity.computeUnitsCount}</Text>
            </Cell>
            {/* Status */}
            <Cell>
              <CapacityStatus status={capacity.status} />
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
