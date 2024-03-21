import React, { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from '@emotion/styled'

import { A } from '../../components/A'
import { ComputeUnitStatus } from '../../components/ComputeUnitStatus'
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

import { ComputeUnitsOrderBy, OrderType } from '../../clients/types/filters'
import { ComputeUnitsWithCCStatus } from '../../clients/types/schemes.ts'

const template = ['30px', 'minmax(10px, 1fr)', '70px']

const COMPUTE_UNITS_PER_PAGE = 4

type ComputeUnitSort = `${ComputeUnitsOrderBy}:${OrderType}`

interface ListComputeUnitsTableProps {
  capacityCommitmentId: string
}

export const ListComputeUnitsTable: React.FC<ListComputeUnitsTableProps> = ({
  capacityCommitmentId,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [order, setOrder] = useState<ComputeUnitSort>('createdAt:desc')
  const [orderBy, orderType] = order.split(':') as [
    ComputeUnitsOrderBy,
    OrderType,
  ]

  const { page, selectPage, limit, offset, getTotalPages } = usePagination(
    COMPUTE_UNITS_PER_PAGE,
  )

  const { data: computeUnits, isLoading } = useApiQuery(
    (client) =>
      client.getComputeUnitsByCapacityCommitment(
        capacityCommitmentId,
        offset,
        limit + 1,
        orderBy,
        orderType,
      ),
    [page, orderBy, orderType],
    {
      key: `capacity-commitment-compute-units:${JSON.stringify({
        capacityCommitmentId,
        offset,
        limit,
        order,
        orderBy,
      })}`,
      ttl: 1_000 * 60, // 1 minute
    },
  )

  const hasNextPage = computeUnits && computeUnits.data.length > limit
  const pageComputeUnits = computeUnits && computeUnits.data.slice(0, limit)
  const indexMultiplier = offset + 1

  return (
    <ListComputeUnitsTableWrapper>
      <Text size={24}>List of compute units</Text>
      {/* <Space height="24px" />
      <ButtonGroup value={value} onSelect={setValue} items={items} /> */}
      <Space height="30px" />
      <ScrollableTable>
        <TableHeader template={template}>
          <TableColumnTitle>#</TableColumnTitle>
          <TableColumnTitle>Compute Unit Id</TableColumnTitle>
          <TableColumnTitle>Status</TableColumnTitle>
        </TableHeader>
        <TableBody skeletonCount={COMPUTE_UNITS_PER_PAGE} isLoading={isLoading}>
          {pageComputeUnits?.map((computeUnit, index) => (
            <ComputeUnitRow
              key={computeUnit.id}
              index={indexMultiplier + index}
              computeUnit={computeUnit}
            />
          ))}
        </TableBody>
      </ScrollableTable>
      <Space height="32px" />
      <TablePagination>
        {!computeUnits ? (
          <Skeleton width={200} height={34} count={1} />
        ) : (
          <Pagination
            pages={getTotalPages(computeUnits.total)}
            page={page}
            hasNextPage={hasNextPage}
            onSelect={selectPage}
          />
        )}
      </TablePagination>
    </ListComputeUnitsTableWrapper>
  )
}

interface CapacityRowProps {
  index: number
  computeUnit: ComputeUnitsWithCCStatus
}

const ComputeUnitRow: React.FC<CapacityRowProps> = ({ computeUnit, index }) => {
  return (
    <RowBlock>
      <RowHeader>
        <RowTrigger>
          <Row template={template}>
            {/* # */}
            <Cell>
              <Text size={12}>{index}</Text>
            </Cell>
            {/* Compute Unit Id */}
            <Cell>
              <A href={`/compute-unit/${computeUnit.id}`}>{computeUnit.id}</A>
            </Cell>
            {/* Status */}
            <Cell>
              <ComputeUnitStatus status={computeUnit.status} />
            </Cell>
          </Row>
        </RowTrigger>
      </RowHeader>
    </RowBlock>
  )
}

const ListComputeUnitsTableWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
`
