import React, { useContext, useEffect, useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from '@emotion/styled'
import {
  CapacityCommitmentsFilters,
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
import { DetailsButton } from '../../components/DetailsButton'
import { LoadMorePagination } from '../../components/Pagination'
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
import { Text } from '../../components/Text'
import { Tooltip } from '../../components/Tooltip'
import { usePagination } from '../../hooks'
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
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  '70px',
]

const CAPACITIES_PER_PAGE = 10

type CapacitySort = `${CapacityCommitmentsOrderBy}:${OrderType}`

interface CapacitiesTableProps {
  filters?: CapacityCommitmentsFilters
}

export const CapacitiesTable: React.FC<CapacitiesTableProps> = ({
  filters,
}) => {
  const client = useContext(ClientContext)
  const [order, setOrder] = useState<CapacitySort>('createdAt:desc')
  const [orderBy, orderType] = order.split(':') as [
    CapacityCommitmentsOrderBy,
    OrderType,
  ]

  const { page, selectPage } = usePagination(CAPACITIES_PER_PAGE)

  useEffect(() => {
    selectPage(1)
  }, [filters?.status])

  const { data, isLoading, hasNextPage, fetchNextPage, fetchPreviousPage } =
    useInfiniteQuery({
      enabled: !!client,
      queryKey: ['capacities', orderBy, orderType, filters, client],
      queryFn: async ({ pageParam }) => {
        if (!client) return { data: [], nextPage: undefined }

        const data = await client.getCapacityCommitments(
          filters,
          CAPACITIES_PER_PAGE * pageParam,
          CAPACITIES_PER_PAGE * (pageParam + 1),
          orderBy,
          orderType,
        )

        return {
          data: data.data,
          nextPage:
            data.data.length < CAPACITIES_PER_PAGE ? undefined : pageParam + 1,
        }
      },
      initialPageParam: 0,
      getNextPageParam: (data) => data.nextPage,
      staleTime: 1_000 * 60,
    })

  const pageData = data?.pages[page - 1]
  const capacities = pageData?.data

  const handleSort = (key: CapacityCommitmentsOrderBy, order: OrderType) => {
    setOrder(`${key}:${order}`)
  }

  const epochDuration = (client?.getEpochDuration() || 0) * 1000

  return (
    <>
      <ScrollableTable>
        <TableHeader template={template}>
          <HeaderCellWithTooltip>
            <TableColumnTitle>Commitment id</TableColumnTitle>
            <Tooltip trigger={<InfoOutlineIcon />}>
              <Text color="grey600" weight={600} size={12}>
                Unique Capacity Commitment Identifier
              </Text>
            </Tooltip>
          </HeaderCellWithTooltip>
          <TableColumnTitleWithSort
            order={orderType}
            field="createdAt"
            isActive={orderBy === 'createdAt'}
            onSort={handleSort}
          >
            Created at
          </TableColumnTitleWithSort>
          <HeaderCellWithTooltip>
            <TableColumnTitle>Duration</TableColumnTitle>
            <Tooltip trigger={<InfoOutlineIcon />}>
              <Text color="grey600" weight={600} size={12}>
                Duration capacity commitment in epochs. Currently, one epoch is
                set as {formatDuration(epochDuration)}
              </Text>
            </Tooltip>
          </HeaderCellWithTooltip>
          <TableColumnTitleWithSort
            order={orderType}
            field="expirationAt"
            isActive={orderBy === 'expirationAt'}
            onSort={handleSort}
          >
            Expiration
          </TableColumnTitleWithSort>
          <TableColumnTitle>Provider id</TableColumnTitle>
          <HeaderCellWithTooltip>
            <TableColumnTitle>Peer id</TableColumnTitle>
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
          <TableColumnTitle>Delegation Rate</TableColumnTitle>
          <TableColumnTitle>Status</TableColumnTitle>
        </TableHeader>
        <TableBody
          skeletonCount={CAPACITIES_PER_PAGE}
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

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    navigate(`/capacity/${capacity.id}`)
  }

  const createdAt = formatUnixTimestamp(capacity.createdAt)
  const expiredAt = capacity.expiredAt
    ? formatUnixTimestamp(capacity.expiredAt)
    : { date: '-', time: '' }

  const capacityDuration =
    capacity.duration * (client?.getEpochDuration() || 0) * 1000

  return (
    <RowBlock>
      <RowHeader onClick={handleClick}>
        <RowTrigger>
          <Row template={template}>
            {/* Commitment id */}
            <Cell>
              <A href={`/capacity/${capacity.id}`}>
                {formatHexData(capacity.id, 8, 10)}
              </A>
            </Cell>
            {/* Created at */}
            <Cell flexDirection="column" alignItems="flex-start">
              <Text size={12}>{createdAt.date}</Text>
              <Text size={12}>{createdAt.time}</Text>
            </Cell>
            {/* Duration */}
            <Cell>
              <Text size={12}>{formatDuration(capacityDuration)}</Text>
            </Cell>
            {/* Expiration */}
            <Cell>
              <Column>
                <Text size={12}>{expiredAt.date}</Text>
                <Text size={12}>{expiredAt.time}</Text>
              </Column>
            </Cell>
            {/* Provider id */}
            <Cell>
              <A href={`/provider/${capacity.providerId}`}>
                {formatHexData(capacity.providerId)}
              </A>
            </Cell>
            {/* Peer id */}
            <Cell>
              <A href={`/peer/${capacity.peerId}`}>
                {formatHexData(capacity.peerId)}
              </A>
            </Cell>
            {/* Compute units */}
            <Cell>
              <Text size={12}>{capacity.computeUnitsCount}</Text>
            </Cell>
            {/* Delegation Rate */}
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

export const Column = styled.div`
  display: flex;
  flex-direction: column;
`
