import React, { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from '@emotion/styled'
import {
  ComputeUnitsOrderBy,
  OrderType,
} from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/filters'
import { ComputeUnitsWithCCStatus } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/schemes'

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
    [
      'capacity-commitment-compute-units',
      JSON.stringify({
        page,
        capacityCommitmentId,
        offset,
        limit,
        order,
        orderBy,
      }),
    ],
    (client) =>
      client.getComputeUnitsByCapacityCommitment(
        capacityCommitmentId,
        0,
        1000,
        orderBy,
        orderType,
      ),
  )

  const hasNextPage = computeUnits && computeUnits.data.length > limit
  const pageComputeUnits =
    computeUnits &&
    computeUnits.data.slice(
      (page - 1) * COMPUTE_UNITS_PER_PAGE,
      page * COMPUTE_UNITS_PER_PAGE,
    )
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
            pages={getTotalPages(computeUnits.data.length)}
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
  width: 80%;
`
