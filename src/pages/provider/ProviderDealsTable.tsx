import React from 'react'
import Skeleton from 'react-loading-skeleton'
import { DealShort } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/schemes'
import { useLocation } from 'wouter'

import { A } from '../../components/A'
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
  TableHeader,
  TablePagination,
} from '../../components/Table'
import { Text } from '../../components/Text'
import { TokenBadge } from '../../components/TokenBadge'
import { useApiQuery, usePagination } from '../../hooks'
import { formatUnixTimestamp } from '../../utils/formatUnixTimestamp'
import { formatHexData } from '../../utils/helpers'

const template = [
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  '100px',
]

interface ProviderDealsTableProps {
  providerId: string
}

const PER_PAGE = 5

export const ProviderDealsTable: React.FC<ProviderDealsTableProps> = ({
  providerId,
}) => {
  const { page, selectPage, limit, offset, getTotalPages } =
    usePagination(PER_PAGE)

  const { data: deals, isLoading } = useApiQuery(
    (client) =>
      client.getDealsByProvider(
        {
          providerId,
        },
        offset,
        limit + 1,
      ),
    [page, providerId],
  )

  const hasNextPage = deals && deals.data.length > limit
  const pageDeals = deals && deals.data.slice(0, limit)

  return (
    <>
      <Text size={32}>Deals</Text>
      <Space height="32px" />
      <ScrollableTable>
        <TableHeader template={template}>
          <TableColumnTitle>Deal Id</TableColumnTitle>
          <TableColumnTitle>Created at</TableColumnTitle>
          <TableColumnTitle>Payment Token</TableColumnTitle>
          <TableColumnTitle>Matched CU</TableColumnTitle>
          <TableColumnTitle>Active Workers</TableColumnTitle>
          <TableColumnTitle>Status</TableColumnTitle>
        </TableHeader>
        <TableBody isLoading={isLoading} skeletonCount={PER_PAGE}>
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

  const createdAt = formatUnixTimestamp(deal.createdAt)

  return (
    <RowBlock>
      <RowHeader
        onClick={() => {
          navigate(`/deal/${deal.id}`)
        }}
      >
        <RowTrigger>
          <Row template={template}>
            <Cell>
              <A href={`/deal/${deal.id}`}>{formatHexData(deal.id)}</A>
            </Cell>
            <Cell flexDirection="column" alignItems="flex-start">
              <Text size={12}>{createdAt.date}</Text>
              <Text size={12}>{createdAt.time}</Text>
            </Cell>
            {/* <Cell>
              <A href={`/offer/${deal.client}`}>{deal.client}</A>
            </Cell> */}
            <Cell>
              <TokenBadge bg="grey200">
                <Text size={10} weight={800} color="grey500">
                  {deal.paymentToken.symbol}
                </Text>
              </TokenBadge>
            </Cell>
            <Cell>
              <Text size={12}>{deal.matchedWorkers}</Text>
            </Cell>
            <Cell>
              {/* TODO: what active workers are actually means?*/}
              <Text size={12}>{deal.registeredWorkers}</Text>
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
