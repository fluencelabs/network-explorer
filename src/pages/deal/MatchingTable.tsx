import React, { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { OrderType } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/filters'
import { ComputeUnitWorkerDetail } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/schemes'

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
import { ShrinkText, Text } from '../../components/Text'
import { WorkerStatus } from '../../components/WorkerStatus'
import { useApiQuery, usePagination } from '../../hooks'

const template = [
  '20px',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
]

const CAPACITIES_PER_PAGE = 20

type MatchingOrderBy = 'createdAt'
type MatchingSort = `${MatchingOrderBy}:${OrderType}`

interface MatchingTableProps {
  dealId: string
}

export const MatchingTable: React.FC<MatchingTableProps> = ({ dealId }) => {
  const [order] = useState<MatchingSort>('createdAt:desc')
  const [orderBy, orderType] = order.split(':') as [MatchingOrderBy, OrderType]

  const { page, selectPage, limit, offset, getTotalPages } =
    usePagination(CAPACITIES_PER_PAGE)

  const { data: computeUnits, isLoading } = useApiQuery(
    (client) =>
      client.getComputeUnitsByDeal(
        dealId,
        offset,
        limit + 1,
        orderBy,
        orderType,
      ),
    [page, orderBy, orderType, dealId],
    {
      key: `matchingTable:${JSON.stringify({
        dealId,
        offset,
        limit,
        order,
        orderBy,
      })}`,
      ttl: 1_000 * 60, // 1 minute
    },
  )

  const hasNextPage = computeUnits && computeUnits.data.length > limit
  const pageCapacities = computeUnits && computeUnits.data.slice(0, limit)
  const indexMultiplier = offset + 1

  // const handleSort = (key: MatchingOrderBy, order: OrderType) => {
  //   setOrder(`${key}:${order}`)
  // }

  return (
    <>
      <ScrollableTable>
        <TableHeader template={template}>
          <TableColumnTitle>#</TableColumnTitle>
          <TableColumnTitle>Provider Id</TableColumnTitle>
          <TableColumnTitle>Compute Unit</TableColumnTitle>
          <TableColumnTitle>Worker Id</TableColumnTitle>
          <TableColumnTitle>Worker Status</TableColumnTitle>
        </TableHeader>
        <TableBody
          isEmpty={!pageCapacities?.length}
          skeletonCount={CAPACITIES_PER_PAGE}
          isLoading={isLoading}
        >
          {pageCapacities?.map((unit, index) => (
            <ComputeUnitWorkerRow
              key={unit.id}
              index={indexMultiplier + index}
              computeUnit={unit}
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
    </>
  )
}

interface ComputeUnitWorkerRowProps {
  index: number
  computeUnit: ComputeUnitWorkerDetail
}

const ComputeUnitWorkerRow: React.FC<ComputeUnitWorkerRowProps> = ({
  index,
  computeUnit,
}) => {
  return (
    <RowBlock>
      <RowHeader>
        <RowTrigger>
          <Row template={template}>
            {/* # */}
            <Cell>
              <Text size={12}>{index}</Text>
            </Cell>
            {/* Provider ID */}
            <Cell>
              <A href={`/provider/${computeUnit.providerId}`}>
                {computeUnit.providerId}
              </A>
            </Cell>
            {/* Compute Unit */}
            <Cell>
              <ShrinkText size={12}>NOT EXIST</ShrinkText>
            </Cell>
            {/* Worker Id  */}
            <Cell>
              <ShrinkText size={12}>{computeUnit.workerId}</ShrinkText>
            </Cell>
            {/* Status */}
            <Cell>
              <WorkerStatus status={computeUnit.workerStatus} />
            </Cell>
          </Row>
        </RowTrigger>
      </RowHeader>
    </RowBlock>
  )
}
