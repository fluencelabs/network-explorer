import React from 'react'
import Skeleton from 'react-loading-skeleton'

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
import { useApiQuery, useOrder, usePagination } from '../../hooks'
import { useFilters } from '../../hooks/useFilters'
import { formatUnixTimestamp } from '../../utils/formatUnixTimestamp'

import {
  ProofsFilters,
  ProofsOrderBy,
} from '../../clients/dealExplorerClient/types/filters'
import { ProofBasic } from '../../clients/dealExplorerClient/types/schemes.ts'

const template = [
  '30px',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  '150px',
]

interface ComputeUnitProofsTableProps {
  computeUnitId: string
}

export const ComputeUnitProofsTable: React.FC<ComputeUnitProofsTableProps> = ({
  computeUnitId,
}) => {
  const [filters] = useFilters<ProofsFilters>({
    computeUnitId,
  })

  const { orderBy, orderType, handleSort } =
    useOrder<ProofsOrderBy>('createdAt:asc')

  const { page, selectPage, limit, offset, getTotalPages, getPageItems } =
    usePagination(5)

  const { data: proofs, isLoading } = useApiQuery(
    (client) =>
      client.getProofs(filters, offset, limit + 1, orderBy, orderType),
    [page, orderBy, orderType],
    {
      key: `compute-unit-proofs:${JSON.stringify({
        filters,
        offset,
        limit,
        orderBy,
        orderType,
      })}`,
      ttl: 1_000 * 60, // 1 minute
    },
  )

  const { hasNextPage, pageItems } = getPageItems(proofs?.data ?? [])

  return (
    <>
      <ScrollableTable>
        <TableHeader template={template}>
          <TableColumnTitle>Epoch</TableColumnTitle>
          <TableColumnTitle>Tx</TableColumnTitle>
          <TableColumnTitleWithSort
            order={orderType}
            field="createdAt"
            isActive={orderBy === 'createdAt'}
            onSort={handleSort}
          >
            Timestamp
          </TableColumnTitleWithSort>
          <TableColumnTitle align="center">Status</TableColumnTitle>
        </TableHeader>
        <TableBody
          isEmpty={!pageItems.length}
          skeletonCount={limit}
          isLoading={isLoading}
        >
          {pageItems.map((proof) => (
            <ProofRow key={proof.capacityCommitmentId} proof={proof} />
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
            {/* Epoch */}
            <Cell>
              <Text size={12}>[NO DATA]</Text>
            </Cell>
            {/* Tx */}
            <Cell>
              <A href={`/offer/${proof.transactionId}`}>
                {proof.transactionId}
              </A>
            </Cell>
            {/* Timestamp */}
            <Cell>
              <Text size={12}>{createdAt.date}</Text>
              <Text size={12}>{createdAt.time}</Text>
            </Cell>
            {/* Status */}
            <Cell>[NO DATA]</Cell>
          </Row>
        </RowTrigger>
      </RowHeader>
    </RowBlock>
  )
}
