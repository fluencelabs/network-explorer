import React, { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from '@emotion/styled'
import {
  OrderType,
  ProofsFilters,
  ProofsOrderBy,
} from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/filters'
import { ProofBasic } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/schemes'

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
  TableColumnTitleWithSort,
  TableHeader,
  TablePagination,
} from '../../components/Table'
import { Text } from '../../components/Text'
import { useApiQuery, usePagination } from '../../hooks'
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
  'minmax(10px, 1fr)',
]

type ProofsSort = `${ProofsOrderBy}:${OrderType}`

interface ProofsTableProps {
  filters: ProofsFilters
}

const PROOFS_PER_PAGE = 10

export const ProofsTable: React.FC<ProofsTableProps> = ({ filters }) => {
  const [order, setOrder] = useState<ProofsSort>('createdAt:desc')
  const [orderBy, orderType] = order.split(':') as [ProofsOrderBy, OrderType]

  const { page, selectPage, limit, offset, getTotalPages } =
    usePagination(PROOFS_PER_PAGE)

  const { data: proofs, isLoading } = useApiQuery(
    (client) =>
      client.getProofs(filters, offset, limit + 1, orderBy, orderType),
    [page, orderBy, orderType, filters],
    {
      key: `proofs:${JSON.stringify({
        filters,
        offset,
        limit,
        order,
        orderBy,
      })}`,
      ttl: 1_000 * 60, // 1 minute
    },
  )

  const hasNextPage = proofs && proofs.data.length > limit
  const pageProofs = proofs && proofs.data.slice(0, limit)

  const handleSort = (key: ProofsOrderBy, order: OrderType) => {
    setOrder(`${key}:${order}`)
  }

  return (
    <>
      <ScrollableTable>
        <TableHeader template={template}>
          <TableColumnTitle>Proof tx</TableColumnTitle>
          <TableColumnTitle>Timestamp</TableColumnTitle>
          <TableColumnTitle>Provider</TableColumnTitle>
          <TableColumnTitle>Capacity commitment</TableColumnTitle>
          <TableColumnTitle>Peer id</TableColumnTitle>
          <TableColumnTitle>Compute unit</TableColumnTitle>
          <TableColumnTitleWithSort
            order={orderType}
            field="epoch"
            isActive={orderBy === 'epoch'}
            onSort={handleSort}
          >
            Epoch
          </TableColumnTitleWithSort>
        </TableHeader>
        <TableBody
          isEmpty={!pageProofs?.length}
          skeletonCount={PROOFS_PER_PAGE}
          isLoading={isLoading}
        >
          {pageProofs?.map((proof) => (
            <ProofRow key={proof.transactionId} proof={proof} />
          ))}
        </TableBody>
      </ScrollableTable>
      <Space height="32px" />
      <TablePagination>
        {!proofs ? (
          <Skeleton width={200} height={34} count={1} />
        ) : (
          <Pagination
            pages={getTotalPages(proofs.total)}
            page={page}
            hasNextPage={hasNextPage}
            onSelect={selectPage}
          />
        )}
      </TablePagination>
    </>
  )
}

interface ProofRowProps {
  proof: ProofBasic
}

const ProofRow: React.FC<ProofRowProps> = ({ proof }) => {
  const createdAt = formatUnixTimestamp(proof.createdAt)

  return (
    <RowBlock>
      <RowHeader>
        <RowTrigger>
          <Row template={template}>
            {/* Proof tx */}
            <Cell>
              <StyledA
                href={`${BLOCKSCOUT_URL}/tx/${proof.transactionId}`}
                onClick={stopPropagation}
                target="_blank"
              >
                {formatHexData(proof.transactionId, 8, 10)}
              </StyledA>
            </Cell>
            {/* Timestamp */}
            <Cell flexDirection="column" alignItems="flex-start">
              <Text size={12}>{createdAt.date}</Text>
              <Text size={12}>{createdAt.time}</Text>
            </Cell>
            {/* Provider id */}
            <Cell>
              <A href={`/provider/${proof.providerId}`}>
                {formatHexData(proof.providerId)}
              </A>
            </Cell>
            {/* Capacity commitment */}
            <Cell>
              <A href={`/capacity/${proof.capacityCommitmentId}`}>
                {formatHexData(proof.capacityCommitmentId)}
              </A>
            </Cell>
            {/* Peer id */}
            <Cell>
              <A href={`/peer/${proof.peerId}`}>
                {formatHexData(proof.peerId)}
              </A>
            </Cell>
            {/* Compute unit */}
            <Cell>
              <A href={`/compute-unit/${proof.computeUnitId}`}>
                {formatHexData(proof.computeUnitId)}
              </A>
            </Cell>
            {/* Epoch */}
            <Cell>
              <Text size={12}>{proof.createdAtEpoch}</Text>
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
