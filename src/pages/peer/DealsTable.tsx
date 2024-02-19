import React, { useState } from 'react'

import { A } from '../../components/A'
import { Pagination } from '../../components/Pagination'
import { Space } from '../../components/Space'
import {
  Cell,
  Row,
  RowBlock,
  RowHeader,
  RowTrigger,
  TableBody,
  TableColumnTitle,
  TableHeader,
} from '../../components/Table'
import { Text } from '../../components/Text'

const template = [
  '30px',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
]

interface DealsTableProps {}

export const DealsTable: React.FC<DealsTableProps> = () => {
  const [page, setPage] = useState(1)

  return (
    <>
      <TableHeader template={template}>
        <TableColumnTitle>#</TableColumnTitle>
        <TableColumnTitle>Deal id</TableColumnTitle>
        <TableColumnTitle>Compute unit</TableColumnTitle>
        <TableColumnTitle>Worker id</TableColumnTitle>
      </TableHeader>
      <TableBody>
        <CapacityRow
          computeUnitId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
          dealId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
        />
        <CapacityRow
          computeUnitId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
          dealId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
        />
        <CapacityRow
          computeUnitId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
          dealId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
        />
        <CapacityRow
          computeUnitId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
          dealId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
        />
        <CapacityRow
          computeUnitId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
          dealId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
        />
        <CapacityRow
          computeUnitId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
          dealId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
        />
      </TableBody>
      <Space height="32px" />
      <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
        <Pagination
          pages={25}
          page={page}
          onSelect={(page) => setPage(() => page)}
        />
      </div>
    </>
  )
}

interface CapacityRowProps {
  computeUnitId: string
  dealId: string
}

const CapacityRow: React.FC<CapacityRowProps> = ({ computeUnitId, dealId }) => {
  return (
    <RowBlock>
      <RowHeader>
        <RowTrigger>
          <Row template={template}>
            {/* # */}
            <Cell>
              <Text size={12}>136</Text>
            </Cell>
            {/* Deal id */}
            <Cell>
              <A href={`/deal/${dealId}`}>{dealId}</A>
            </Cell>
            {/* Compute unit */}
            <Cell>
              <A href={`/compute-unit/${computeUnitId}`}>{computeUnitId}</A>
            </Cell>
            {/* Worker id */}
            <Cell>
              <Text size={12}>
                12D3KooWAKNos2KogexTX...pLHuWJ4PgoAhurSAv7o5CWA
              </Text>
            </Cell>
          </Row>
        </RowTrigger>
      </RowHeader>
    </RowBlock>
  )
}
