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
  ScrollableTable,
  TableBody,
  TableColumnTitle,
  TableHeader,
  TablePagination,
} from '../../components/Table'
import { Text } from '../../components/Text'

const template = [
  '30px',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  '100px',
]

export const CapacityCommitmentsTable: React.FC = () => {
  const [page, setPage] = useState(1)

  return (
    <>
      <ScrollableTable>
        <TableHeader template={template}>
          <TableColumnTitle>#</TableColumnTitle>
          <TableColumnTitle>Capacity commitment</TableColumnTitle>
          <TableColumnTitle>Created at</TableColumnTitle>
          <TableColumnTitle>Expiration</TableColumnTitle>
          <TableColumnTitle>Compute units</TableColumnTitle>
          <TableColumnTitle align="center">Status</TableColumnTitle>
        </TableHeader>
        <TableBody>
          <CapacityRow commitmentId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1" />
          <CapacityRow commitmentId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1" />
          <CapacityRow commitmentId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1" />
          <CapacityRow commitmentId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1" />
          <CapacityRow commitmentId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1" />
          <CapacityRow commitmentId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1" />
        </TableBody>
      </ScrollableTable>
      <Space height="32px" />
      <TablePagination>
        <Pagination
          pages={25}
          page={page}
          onSelect={(page) => setPage(() => page)}
        />
      </TablePagination>
    </>
  )
}

interface CapacityRowProps {
  commitmentId: string
}

const CapacityRow: React.FC<CapacityRowProps> = ({ commitmentId }) => {
  return (
    <RowBlock>
      <RowHeader>
        <RowTrigger>
          <Row template={template}>
            {/* # */}
            <Cell>
              <Text size={12}>136</Text>
            </Cell>
            {/* Capacity commitment */}
            <Cell>
              <A href={`/capacity/${commitmentId}`}>{commitmentId}</A>
            </Cell>
            {/* Created at */}
            <Cell>
              <Text size={12}>1 Sep 2023</Text>
            </Cell>
            {/* Expiration */}
            <Cell>
              <Text size={12}>1 Sep 2024</Text>
            </Cell>
            {/* Compute units */}
            <Cell>
              <Text size={12}>136</Text>
            </Cell>
            {/* Status */}
            <Cell>
              <Status color="green">
                <Text size={12} color="white" uppercase weight={800}>
                  Active
                </Text>
              </Status>
            </Cell>
          </Row>
        </RowTrigger>
      </RowHeader>
    </RowBlock>
  )
}
