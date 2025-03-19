import React, { useContext, useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import {
  CapacityCommitmentsByProviderFilter,
  CapacityCommitmentsOrderBy,
  OrderType,
} from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/filters'
import { CapacityCommitmentShort } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/schemes'
import { useInfiniteQuery } from '@tanstack/react-query'
import { useLocation } from 'wouter'

import { InfoOutlineIcon } from '../../assets/icons'
import { A } from '../../components/A'
import { CapacityStatus } from '../../components/CapacityStatus'
import { ClientContext } from '../../components/ClientProvider'
import { LoadMorePagination } from '../../components/Pagination'
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
import { useClient, usePagination } from '../../hooks'
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
  const client = useClient()
  const [filters, setFilter] = useFilters<CapacityCommitmentsByProviderFilter>({
    providerId,
  })

  const [order, setOrder] = useState<ProviderCapacitySort>('createdAt:desc')
  const [orderBy, orderType] = order.split(':') as [
    CapacityCommitmentsOrderBy,
    OrderType,
  ]

  const { page, selectPage } = usePagination(PROVIDER_CAPACITIES_PER_PAGE)

  useEffect(() => {
    selectPage(1)
  }, [filters?.status])

  const { data, isLoading, hasNextPage, fetchNextPage, fetchPreviousPage } =
    useInfiniteQuery({
      enabled: !!client,
      queryKey: [
        'provider-capacities',
        page,
        orderBy,
        orderType,
        filters.status,
        filters.providerId,
        client,
      ],
      queryFn: async ({ pageParam }) => {
        if (!client) return { data: [], nextPage: undefined }

        const data = await client.getCapacityCommitmentsByProvider(
          filters,
          PROVIDER_CAPACITIES_PER_PAGE * pageParam,
          PROVIDER_CAPACITIES_PER_PAGE * (pageParam + 1),
          orderBy,
          orderType,
        )

        return {
          data: data.data,
          nextPage:
            data.data.length < PROVIDER_CAPACITIES_PER_PAGE
              ? undefined
              : pageParam + 1,
        }
      },
      initialPageParam: 0,
      getNextPageParam: (data) => data.nextPage,
      queryKeyHashFn: () =>
        `provider-capacities:${JSON.stringify({
          filters,
          order,
          orderBy,
        })}`,
      staleTime: 1_000 * 60,
    })

  const pageData = data?.pages[page - 1]
  const capacities = pageData?.data

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
          isEmpty={capacities?.length === 0}
          noDataText={
            filters?.status !== undefined
              ? 'No capacity commitments with the status you specified'
              : 'No capacity commitments'
          }
        >
          {capacities?.map((capacity) => (
            <CapacityRow key={capacity.id} capacity={capacity} />
          ))}
        </TableBody>
      </ScrollableTable>
      <Space height="32px" />
      <TablePagination>
        {isLoading ? (
          <Skeleton width={200} height={34} count={1} />
        ) : (
          <LoadMorePagination
            page={page}
            hasNextPage={
              page !== data?.pages.length ||
              (page === data?.pages.length && hasNextPage)
            }
            onNext={() => {
              selectPage(page + 1)
              fetchNextPage()
            }}
            onPrev={() => {
              selectPage(page - 1)
              fetchPreviousPage()
            }}
            onFirst={() => selectPage(1)}
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
