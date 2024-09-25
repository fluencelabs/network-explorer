import React from 'react'
import Skeleton from 'react-loading-skeleton'
import { STATUS_NAMES } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/constants'
import {
  CapacityCommitmentsByPeerFilter,
  CapacityCommitmentsOrderBy,
  CapacityCommitmentsStatusFilter,
  ProviderChildEntityStatusFilter,
} from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/filters'
import { CapacityCommitmentShort } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/schemes'

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
import { formatHexData } from '../../utils/helpers'

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
  { value: 'active', label: STATUS_NAMES['active'] },
  { value: 'inactive', label: STATUS_NAMES['inactive'] },
]

interface PeerCapacityCommitmentsTableProps {
  peerId: string
}

export const PeerCapacityCommitmentsTable: React.FC<
  PeerCapacityCommitmentsTableProps
> = ({ peerId }) => {
  const [filters, setFilter] = useFilters<CapacityCommitmentsByPeerFilter>({
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

  const handleSetStatus = (value: CapacityCommitmentsStatusFilter | 'all') => {
    const filter = value === 'all' ? undefined : value
    setFilter('status', filter)
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
              <A href={`/capacity/${capacity.id}`}>
                {formatHexData(capacity.id, 10, 12)}
              </A>
            </Cell>
            {/* Created at */}
            <Cell flexDirection="column" alignItems="flex-start">
              <Text size={12}>{createdAt.date}</Text>
              <Text size={12}>{createdAt.time}</Text>
            </Cell>
            {/* Expiration */}
            <Cell flexDirection="column" alignItems="flex-start">
              <Text size={12}>{expiredAt.date}</Text>
              <Text size={12}>{expiredAt.time}</Text>
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
