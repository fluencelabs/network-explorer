import React from 'react'
import Skeleton from 'react-loading-skeleton'
import { DealByPeer } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/schemes'

import { A } from '../../components/A'
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
import { useApiQuery, useOrder, usePagination } from '../../hooks'
import { formatHexData } from '../../utils/helpers'

const template = [
  '30px',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
]

interface PeerDealsTableProps {
  peerId: string
}

export const PeerDealsTable: React.FC<PeerDealsTableProps> = ({ peerId }) => {
  const { orderBy, orderType } = useOrder<'id'>('id:desc')

  const { page, selectPage, limit, offset, getTotalPages, getPageItems } =
    usePagination(5)

  const { data: deals, isLoading } = useApiQuery(
    (client) =>
      client.getDealsByPeer(peerId, offset, limit + 1, orderBy, orderType),
    [page, orderBy, orderType],
    {
      key: `peer-deals:${JSON.stringify({
        peerId,
        offset,
        limit,
        orderBy,
        orderType,
      })}`,
      ttl: 1_000 * 60, // 1 minute
    },
  )

  const { hasNextPage, pageItems } = getPageItems(deals?.data ?? [])

  return (
    <>
      <Text size={32}>Deals</Text>
      <Space height="32px" />
      <ScrollableTable>
        <TableHeader template={template}>
          <TableColumnTitle>#</TableColumnTitle>
          <TableColumnTitle>Deal id</TableColumnTitle>
          <TableColumnTitle>Compute unit</TableColumnTitle>
          <TableColumnTitle>Worker id</TableColumnTitle>
        </TableHeader>
        <TableBody
          isEmpty={!pageItems.length}
          skeletonCount={limit}
          isLoading={isLoading}
        >
          {pageItems.map((deal, index) => (
            <DealRow key={deal.dealId} index={offset + index + 1} deal={deal} />
          ))}
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
  index: number
  deal: DealByPeer
}

const DealRow: React.FC<DealRowProps> = ({ index, deal }) => {
  return (
    <RowBlock>
      <RowHeader>
        <RowTrigger>
          <Row template={template}>
            {/* # */}
            <Cell>
              <Text size={12}>{index}</Text>
            </Cell>
            {/* Deal id */}
            <Cell>
              <A href={`/deal/${deal.dealId}`}>{formatHexData(deal.dealId)}</A>
            </Cell>
            {/* Compute unit */}
            <Cell>
              <A href={`/compute-unit/${deal.computeUnitId}`}>
                {deal.computeUnitId}
              </A>
            </Cell>
            {/* Worker id */}
            <Cell>
              <Text size={12}>{deal.workerId}</Text>
            </Cell>
          </Row>
        </RowTrigger>
      </RowHeader>
    </RowBlock>
  )
}
