import React from 'react'
import { WorkerDetail } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/schemes'

import { A } from '../../components/A'
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
} from '../../components/Table'
import { ShrinkText, Text } from '../../components/Text'
import { WorkerStatus } from '../../components/WorkerStatus'
import { useApiQuery } from '../../hooks'
import { formatHexData } from '../../utils/helpers'

const template = [
  '20px',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
]

interface MatchingTableProps {
  dealId: string
}

export const MatchingTable: React.FC<MatchingTableProps> = ({ dealId }) => {
  const { data, isLoading } = useApiQuery(
    (client) => client.getWorkersByDeal(dealId),
    [dealId],
    {
      key: `matchingTable:${JSON.stringify({
        dealId,
      })}`,
      ttl: 1_000 * 60,
    },
  )

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
          isEmpty={data?.data.length === 0}
          skeletonCount={5}
          isLoading={isLoading}
          noDataText="No found any workers"
        >
          {data?.data.map((worker) => (
            <WorkerDetailRow key={worker.id} worker={worker} />
          ))}
        </TableBody>
      </ScrollableTable>
    </>
  )
}
interface WorkerDetailRowProps {
  worker: WorkerDetail
}

const WorkerDetailRow: React.FC<WorkerDetailRowProps> = ({ worker }) => {
  return (
    <RowBlock>
      <RowHeader>
        <RowTrigger>
          <Row template={template}>
            {/* # */}
            <Cell>
              <Text size={12}>{formatHexData(worker.id, 10, 10)}</Text>
            </Cell>
            {/* Provider ID */}
            <Cell>
              <A href={`/provider/${worker.providerId}`}>
                {formatHexData(worker.providerId, 10, 10)}
              </A>
            </Cell>
            {/* Compute Unit */}
            <Cell>
              <ShrinkText size={12}>{worker.cuCount}</ShrinkText>
            </Cell>
            {/* Status */}
            <Cell>
              <WorkerStatus hasOffChainId={!!worker.offchainWorkerId} />
            </Cell>
          </Row>
        </RowTrigger>
      </RowHeader>
    </RowBlock>
  )
}
