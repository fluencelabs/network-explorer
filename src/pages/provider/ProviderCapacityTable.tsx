import React, { useContext, useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import {
  CapacityCommitmentsByProviderFilter,
  CapacityCommitmentsOrderBy,
  OrderType,
} from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/filters'
import { CapacityCommitmentShort } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/schemes'
import { useLocation } from 'wouter'

import { InfoOutlineIcon } from '../../assets/icons'
import { A } from '../../components/A'
import { CapacityStatus } from '../../components/CapacityStatus'
import { ClientContext } from '../../components/ClientProvider'
import { Pagination } from '../../components/Pagination'
import { SelectStatus, SelectStatusValue } from '../../components/SelectStatus'
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
import { formatDuration } from '../../utils/formatDuration'
import { formatUnixTimestamp } from '../../utils/formatUnixTimestamp'
import { formatHexData } from '../../utils/helpers'

const template = [
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  '100px',
]

interface ProviderCapacityTableProps {
  providerId: string
}

const PROVIDER_CAPACITIES_PER_PAGE = 15

type ProviderCapacitySort = `${CapacityCommitmentsOrderBy}:${OrderType}`

export const ProviderCapacityTable: React.FC<ProviderCapacityTableProps> = ({
  providerId,
}) => {
  const [filters, setFilter] = useFilters<CapacityCommitmentsByProviderFilter>({
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

  useEffect(() => {
    selectPage(1)
  }, [filters?.status])

  const hasNextPage = capacities && capacities.data.length > limit
  const pageCapacities = capacities && capacities.data.slice(0, limit)

  const handleSort = (key: CapacityCommitmentsOrderBy, order: OrderType) => {
    setOrder(`${key}:${order}`)
  }

  const handleSetStatus = (value: SelectStatusValue) => {
    const filter = value === 'all' || value === 'undefined' ? undefined : value
    setFilter('status', filter)
  }

  return (
    <>
      <Text size={32}>Capacity commitments</Text>
      <Space height="24px" />
      <SelectStatus value={filters.status} onChange={handleSetStatus} />
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
              <Text color="grey600" weight={600} size={12}>
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
          <TableColumnTitle>Staker reward</TableColumnTitle>
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
  const client = useContext(ClientContext)

  const createdAt = formatUnixTimestamp(capacity.createdAt)
  const expiredAt = capacity.expiredAt
    ? formatUnixTimestamp(capacity.expiredAt)
    : { date: '-', time: '' }

  const capacityDuration =
    capacity.duration * (client?.getEpochDuration() || 0) * 1000

  return (
    <RowBlock>
      <RowHeader onClick={() => navigate(`/capacity/${capacity.id}`)}>
        <RowTrigger>
          <Row template={template}>
            {/* Commitment Id */}
            <Cell>
              <A href={`/capacity/${capacity.id}`}>
                {formatHexData(capacity.id)}
              </A>
            </Cell>
            {/* # Created At */}
            <Cell flexDirection="column" alignItems="flex-start">
              <Text size={12}>{createdAt.date}</Text>
              <Text size={12}>{createdAt.time}</Text>
            </Cell>
            {/* Duration */}
            <Cell flexDirection="column" alignItems="flex-start">
              <Text size={12}>{formatDuration(capacityDuration)}</Text>
            </Cell>
            {/* Expiration */}
            <Cell flexDirection="column" alignItems="flex-start">
              <Text size={12}>{expiredAt.date}</Text>
              <Text size={12}>{expiredAt.time}</Text>
            </Cell>
            {/* Peer Id */}
            <Cell>
              <ShrinkText size={12}>
                <A href={`/peer/${capacity.peerId}`}>
                  {formatHexData(capacity.peerId)}
                </A>
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
          </Row>
        </RowTrigger>
      </RowHeader>
    </RowBlock>
  )
}
