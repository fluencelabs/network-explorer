import React, { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from '@emotion/styled'
import {
  CapacityCommitmentsFilters,
  CapacityCommitmentsOrderBy,
  OrderType,
} from '@fluencelabs/deal-aurora/dist/dealExplorerClient/types/filters'
import { CapacityCommitmentShort } from '@fluencelabs/deal-aurora/dist/dealExplorerClient/types/schemes'
import { useLocation } from 'wouter'

import { InfoOutlineIcon } from '../../assets/icons'
import { A } from '../../components/A'
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
import { Text } from '../../components/Text'
import { Tooltip } from '../../components/Tooltip'
import { useApiQuery, usePagination } from '../../hooks'
import { formatUnixTimestamp } from '../../utils/formatUnixTimestamp'

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
  const [order, setOrder] = useState<CapacitySort>('createdAt:desc')
  const [orderBy, orderType] = order.split(':') as [
    CapacityCommitmentsOrderBy,
    OrderType,
  ]

  const { page, selectPage, limit, offset, getTotalPages } =
    usePagination(CAPACITIES_PER_PAGE)

  const { data: capacities, isLoading } = useApiQuery(
    (client) =>
      client.getCapacityCommitments(
        filters,
        offset,
        limit + 1,
        orderBy,
        orderType,
      ),
    [page, orderBy, orderType, filters],
    {
      key: `capacities:${JSON.stringify({
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

  return (
    <>
      <ScrollableTable>
        <TableHeader template={template}>
          <HeaderCellWithTooltip>
            <TableColumnTitle>Commitment id</TableColumnTitle>
            <Tooltip trigger={<InfoOutlineIcon />}>
              <Text color="grey600" weight={600}>
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
              <Text color="grey600" weight={600}>
                Duration capacity commitment in epochs. Currently, one epoch is
                set as 24 hours.
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
          <TableColumnTitle>Delegation Rate</TableColumnTitle>
          <TableColumnTitle>Status</TableColumnTitle>
        </TableHeader>
        <TableBody skeletonCount={CAPACITIES_PER_PAGE} isLoading={isLoading}>
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

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    navigate(`/capacity/${capacity.id}`)
  }

  const createdAt = formatUnixTimestamp(capacity.createdAt)
  const expiredAt = capacity.expiredAt
    ? formatUnixTimestamp(capacity.expiredAt)
    : { date: '-', time: '' }

  return (
    <RowBlock>
      <RowHeader onClick={handleClick}>
        <RowTrigger>
          <Row template={template}>
            {/* Commitment id */}
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
            {/* Duration */}
            <Cell>
              <Text size={12}>{capacity.duration}</Text>
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
                {capacity.providerId}
              </A>
            </Cell>
            {/* Peer id */}
            <Cell>
              <A href={`/peer/${capacity.peerId}`}>{capacity.peerId}</A>
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
