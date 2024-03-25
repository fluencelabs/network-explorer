import React, { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from '@emotion/styled'

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
import { useApiQuery, usePagination } from '../../hooks'

import {
  OrderType,
  ProofStatsByCapacityCommitmentOrderBy,
} from '../../clients/dealExplorerClient/types/filters'
import { ProofStatsByCapacityCommitment } from '../../clients/dealExplorerClient/types/schemes.ts'

const template = [
  '30px',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
]

const PROOFS_PER_PAGE = 6

type ProofSort = `${ProofStatsByCapacityCommitmentOrderBy}:${OrderType}`

interface ProofsTableProps {
  capacityCommitmentId: string
}

export const ProofsTable: React.FC<ProofsTableProps> = ({
  capacityCommitmentId,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [order, setOrder] = useState<ProofSort>('epoch:asc')
  const [orderBy, orderType] = order.split(':') as [
    ProofStatsByCapacityCommitmentOrderBy,
    OrderType,
  ]

  const { page, selectPage, limit, offset, getTotalPages } =
    usePagination(PROOFS_PER_PAGE)

  const { data: proofs, isLoading } = useApiQuery(
    (client) =>
      client.getProofsByCapacityCommitment(
        capacityCommitmentId,
        offset,
        limit + 1,
        orderBy,
        orderType,
      ),
    [page, orderBy, orderType],
    {
      key: `capacity-commitment-proofs:${JSON.stringify({
        capacityCommitmentId,
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

  return (
    <ProofsTableWrapper>
      <Text size={24}>History of epoches</Text>
      <Space height="30px" />
      <ScrollableTable>
        <TableHeader template={template} alignItems="flex-start">
          <TableColumnTitle>Epoch</TableColumnTitle>
          <TableColumnTitle wrap>Epoch period (blocks)</TableColumnTitle>
          <TableColumnTitle wrap>Expected Number of CUs</TableColumnTitle>
          <TableColumnTitle wrap>Successful CUs / Failed CU</TableColumnTitle>
          <TableColumnTitle>Total proofs</TableColumnTitle>
          <TableColumnTitle wrap>Average proofs per CU</TableColumnTitle>
        </TableHeader>
        <TableBody
          isEmpty={!pageProofs?.length}
          skeletonCount={PROOFS_PER_PAGE}
          isLoading={isLoading}
        >
          {pageProofs?.map((proof) => (
            <ProofRow key={JSON.stringify(proof)} proof={proof} />
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
    </ProofsTableWrapper>
  )
}

interface ProofRow {
  proof: ProofStatsByCapacityCommitment
}

const ProofRow: React.FC<ProofRow> = ({ proof }) => {
  return (
    <RowBlock>
      <RowHeader>
        <RowTrigger>
          <Row template={template}>
            {/* Epoch */}
            <Cell>
              <Text size={12}>{proof.createdAtEpoch}</Text>
            </Cell>
            {/* Epoch period (blocks) */}
            <Cell>
              <Text size={12}>
                {proof.createdAtEpochBlockNumberStart} -{' '}
                {proof.createdAtEpochBlockNumberEnd}
              </Text>
            </Cell>
            {/* Expected Number of CUs */}
            <Cell>
              <Text size={12}>{proof.computeUnitsExpected}</Text>
            </Cell>
            {/* Successful CUs / Failed CU */}
            <Cell>
              <Text size={12} color={'green'}>
                {proof.computeUnitsSuccess}
              </Text>
              <Text size={12}>&nbsp;/&nbsp;</Text>
              <Text size={12} color={'red'}>
                {proof.computeUnitsFailed}
              </Text>
            </Cell>
            {/* Total proofs */}
            <Cell>
              <Text size={12}>{proof.submittedProofs}</Text>
            </Cell>
            {/* Average proofs per CU */}
            <Cell>
              <Text size={12}>{proof.submittedProofsPerCU}</Text>
            </Cell>
          </Row>
        </RowTrigger>
      </RowHeader>
    </RowBlock>
  )
}

const ProofsTableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
`
