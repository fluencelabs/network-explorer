import React, { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from '@emotion/styled'
import {
  DealsFilters,
  DealsShortOrderBy,
  OrderType,
} from '@fluencelabs/deal-aurora/dist/dealExplorerClient/types/filters'
import { DealShort } from '@fluencelabs/deal-aurora/dist/dealExplorerClient/types/schemes'
import { useLocation } from 'wouter'

import { A } from '../../components/A'
import { DealStatus } from '../../components/DealStatus'
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
import { TokenBadge } from '../../components/TokenBadge'
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
  '70px',
]

const DEALS_PER_PAGE = 5

type DealSort = `${DealsShortOrderBy}:${OrderType}`

interface DealsTableProps {
  filters: DealsFilters
}

export const DealsTable: React.FC<DealsTableProps> = ({ filters }) => {
  const [order, setOrder] = useState<DealSort>('createdAt:desc')
  const [orderBy, orderType] = order.split(':') as [
    DealsShortOrderBy,
    OrderType,
  ]

  const { page, selectPage, limit, offset, getTotalPages } =
    usePagination(DEALS_PER_PAGE)

  const { data: deals, isLoading } = useApiQuery(
    (client) => {
      return client.getDeals(filters, offset, limit + 1, orderBy, orderType)
    },
    [page, orderBy, orderType, filters],
    {
      key: `deals:${JSON.stringify({
        filters,
        offset,
        limit,
        order,
        orderBy,
      })}`,
      ttl: 1_000 * 60, // 1 minute
    },
  )

  const hasNextPage = deals && deals.data.length > limit
  const pageDeals = deals && deals.data.slice(0, limit)

  const handleSort = (key: DealsShortOrderBy, order: OrderType) => {
    setOrder(`${key}:${order}`)
  }

  return (
    <>
      <ScrollableTable>
        <TableHeader template={template}>
          <TableColumnTitle>Deal Id</TableColumnTitle>
          <TableColumnTitleWithSort
            order={orderType}
            field="createdAt"
            isActive={orderBy === 'createdAt'}
            onSort={handleSort}
          >
            Created At
          </TableColumnTitleWithSort>
          <TableColumnTitle>Client</TableColumnTitle>
          <HeaderCellWithTooltip>
            <TableColumnTitle>Matching</TableColumnTitle>
            <Tooltip>
              <Text color="grey600" weight={600} size={12}>
                Matching Process results: Minimum Participants Required for the
                Deal, Current Matched Participants / Maximum Potential
                Participants
              </Text>
            </Tooltip>
          </HeaderCellWithTooltip>
          <TableColumnTitle>Balance</TableColumnTitle>
          <TableColumnTitle>Providers earnings</TableColumnTitle>
          <TableColumnTitle>Status</TableColumnTitle>
        </TableHeader>
        <TableBody
          skeletonCount={DEALS_PER_PAGE}
          skeletonHeight={48}
          isLoading={isLoading}
        >
          {pageDeals?.map((deal) => <DealRow key={deal.id} deal={deal} />)}
        </TableBody>
      </ScrollableTable>
      <Space height="32px" />
      <TablePagination>
        {!deals ? (
          <Skeleton width={200} height={34} count={1} />
        ) : (
          <Pagination
            pages={getTotalPages(deals.total)}
            page={page}
            hasNextPage={hasNextPage}
            onSelect={selectPage}
          />
        )}
      </TablePagination>
    </>
  )
}

interface DealRowProps {
  deal: DealShort
}

const DealRow: React.FC<DealRowProps> = ({ deal }) => {
  const [, navigate] = useLocation()

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    navigate(`/deal/${deal.id}`)
  }

  const createdAt = formatUnixTimestamp(deal.createdAt)

  return (
    <RowBlock>
      <RowHeader onClick={handleClick}>
        <RowTrigger>
          <Row template={template}>
            {/* deal ID */}
            <Cell>
              <A href={`/deal/${deal.id}`}>{deal.id}</A>
            </Cell>
            {/* Created at */}
            <Cell flexDirection="column" alignItems="flex-start">
              <Text size={12}>{createdAt.date}</Text>
              <Text size={12}>{createdAt.time}</Text>
            </Cell>
            {/* Client */}
            <Cell>
              <ShrinkText size={12} color="blue">
                {deal.client}
              </ShrinkText>
            </Cell>
            {/* Matching */}
            <Cell>
              <Text size={12}>
                {deal.minWorkers}, {deal.matchedWorkers}/{deal.targetWorkers}
              </Text>
            </Cell>
            {/* Balance */}
            <Cell>
              <TextWithBadge>
                <Text size={12}>{deal.balance}</Text>
                <TokenBadge>
                  <Text color="grey500" weight={800} size={10}>
                    {deal.paymentToken.symbol}
                  </Text>
                </TokenBadge>
              </TextWithBadge>
            </Cell>
            {/* Providers earnings */}
            <Cell>
              <TextWithBadge>
                <Text size={12}>{deal.totalEarnings}</Text>
                <TokenBadge>
                  <Text color="grey500" weight={800} size={10}>
                    {deal.paymentToken.symbol}
                  </Text>
                </TokenBadge>
              </TextWithBadge>
            </Cell>
            {/* Status */}
            <Cell>
              <DealStatus status={deal.status} />
            </Cell>
            <Cell>
              <DetailsButton>
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

const TextWithBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`
