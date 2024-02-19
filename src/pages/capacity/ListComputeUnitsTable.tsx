import React, { useState } from 'react'

import { A } from '../../components/A'
import { Pagination } from '../../components/Pagination'
import { Space } from '../../components/Space'
import { Status } from '../../components/Status'
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

const template = ['30px', 'minmax(10px, 1fr)', '70px']

export const ListComputeUnitsTable: React.FC = () => {
  const [page, setPage] = useState(1)

  return (
    <>
      <TableHeader template={template}>
        <TableColumnTitle>#</TableColumnTitle>
        <TableColumnTitle>Compute Unit Id</TableColumnTitle>
        <TableColumnTitle>Status</TableColumnTitle>
      </TableHeader>
      <TableBody>
        <ComputeUnitRow computeUnitId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1" />
        <ComputeUnitRow computeUnitId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1" />
        <ComputeUnitRow computeUnitId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1" />
        <ComputeUnitRow computeUnitId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1" />
        <ComputeUnitRow computeUnitId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1" />
        <ComputeUnitRow computeUnitId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1" />
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
}

const ComputeUnitRow: React.FC<CapacityRowProps> = ({ computeUnitId }) => {
  return (
    <RowBlock>
      <RowHeader>
        <RowTrigger>
          <Row template={template}>
            {/* # */}
            <Cell>
              <Text size={12}>136</Text>
            </Cell>
            {/* Compute Unit Id */}
            <Cell>
              <A href={`/compute-unit/${computeUnitId}`}>{computeUnitId}</A>
            </Cell>
            {/* Status */}
            <Cell>
              <Status color="blue">
                <Text size={10} color="white" uppercase weight={800}>
                  Capacity
                </Text>
              </Status>
            </Cell>
          </Row>
        </RowTrigger>
      </RowHeader>
    </RowBlock>
  )
}
