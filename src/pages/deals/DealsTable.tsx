import React, { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from '@emotion/styled'
import {
  DealsFilters,
  DealsShortOrderBy,
  OrderType,
} from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/filters'
import { DealShort } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/schemes'
import { useLocation } from 'wouter'

import { A } from '../../components/A'
import { Copyable } from '../../components/Copyable'
import { DealStatus } from '../../components/DealStatus'
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
import { ShrinkText, Text, TextWithIcon } from '../../components/Text'
import { TokenBadge } from '../../components/TokenBadge'
import { useApiQuery, usePagination } from '../../hooks'
import { formatUSDcTokenValue } from '../../utils'
import { formatUnixTimestamp } from '../../utils/formatUnixTimestamp'
import { formatHexData, stopPropagation } from '../../utils/helpers'

import { colors } from '../../constants/colors'
import { BLOCKSCOUT_URL } from '../../constants/config'

const template = [
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
]

export const DEALS_PER_PAGE = 5

type DealSort = `${DealsShortOrderBy}:${OrderType}`

interface DealsTableProps {
  filters: DealsFilters
  pagination: ReturnType<typeof usePagination>
}

export const DealsTable: React.FC<DealsTableProps> = ({
  filters,
  pagination,
}) => {
  const [order, setOrder] = useState<DealSort>('createdAt:desc')
  const [orderBy, orderType] = order.split(':') as [
    DealsShortOrderBy,
    OrderType,
  ]

  const { page, selectPage, limit, offset, getTotalPages } = pagination

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
          <TableColumnTitle>Max renting period</TableColumnTitle>
          <TableColumnTitle>Client</TableColumnTitle>
          <TableColumnTitle>Balance</TableColumnTitle>
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
          deals.total !== null && (
            <Pagination
              pages={getTotalPages(deals.total)}
              page={page}
              hasNextPage={hasNextPage}
              onSelect={selectPage}
            />
          )
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

  const [copyShown, setCopyshown] = useState(false)

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    navigate(`/deal/${deal.id}`)
  }

  const createdAt = formatUnixTimestamp(deal.createdAt)
  const rentingPeriodAt =
    deal.minRentingPeriodEndAt === null
      ? null
      : formatUnixTimestamp(deal.minRentingPeriodEndAt)

  return (
    <RowBlock>
      <RowHeader onClick={handleClick}>
        <RowTrigger>
          <Row template={template}>
            <Cell>
              <A href={`/deal/${deal.id}`}>{formatHexData(deal.id)}</A>
            </Cell>
            <Cell flexDirection="column" alignItems="flex-start">
              <Text size={12}>{createdAt.date}</Text>
              <Text size={12}>{createdAt.time}</Text>
            </Cell>
            <Cell flexDirection="column" alignItems="flex-start">
              {rentingPeriodAt ? (
                <>
                  <Text size={12}>{rentingPeriodAt.date}</Text>
                  <Text size={12}>{rentingPeriodAt.time}</Text>
                </>
              ) : (
                '-'
              )}
            </Cell>
            <Cell
              onMouseOver={() => setCopyshown(true)}
              onMouseLeave={() => setCopyshown(false)}
            >
              <ShrinkText size={12} color="blue">
                <StyledA
                  href={BLOCKSCOUT_URL + `address/${deal.client}`}
                  target="_blank"
                  onClick={stopPropagation}
                >
                  {formatHexData(deal.client)}
                </StyledA>
              </ShrinkText>
              {copyShown && <Copyable value={deal.client} />}
            </Cell>
            <Cell>
              <TextWithIcon>
                <Text size={12}>{formatUSDcTokenValue(deal.balance)}</Text>
                <TokenBadge>
                  <Text color="grey500" weight={800} size={10}>
                    {deal.paymentToken.symbol}
                  </Text>
                </TokenBadge>
              </TextWithIcon>
            </Cell>
            <Cell>
              <DealStatus status={deal.status} />
            </Cell>
          </Row>
        </RowTrigger>
      </RowHeader>
    </RowBlock>
  )
}

const StyledA = styled.a`
  gap: 4px;
  font-size: 12px;
  color: ${colors.blue};
`
