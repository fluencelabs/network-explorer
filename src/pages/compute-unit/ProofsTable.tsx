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
import { ShrinkText, Text } from '../../components/Text'
import { TokenBadge } from '../../components/TokenBadge'

const template = [
  '30px',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  '150px',
]

export const ProofsTable: React.FC = () => {
  const [page, setPage] = useState(1)

  return (
    <>
      <ScrollableTable>
        <TableHeader template={template}>
          <TableColumnTitle>Epoch</TableColumnTitle>
          <TableColumnTitle>Tx</TableColumnTitle>
          <TableColumnTitle>Timestamp</TableColumnTitle>
          <TableColumnTitle>Collateral</TableColumnTitle>
          <TableColumnTitle align="center">Status</TableColumnTitle>
        </TableHeader>
        <TableBody>
          <ProofRow tx="5e9d7ffe-5b01-43a0-9243-782e4572f1d1" />
          <ProofRow tx="5e9d7ffe-5b01-43a0-9243-782e4572f1d1" />
          <ProofRow tx="5e9d7ffe-5b01-43a0-9243-782e4572f1d1" />
          <ProofRow tx="5e9d7ffe-5b01-43a0-9243-782e4572f1d1" />
          <ProofRow tx="5e9d7ffe-5b01-43a0-9243-782e4572f1d1" />
          <ProofRow tx="5e9d7ffe-5b01-43a0-9243-782e4572f1d1" />
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

interface ProofRowProps {
  tx: string
}

const ProofRow: React.FC<ProofRowProps> = ({ tx }) => {
  return (
    <RowBlock>
      <RowHeader>
        <RowTrigger>
          <Row template={template}>
            {/* Epoch */}
            <Cell>
              <Text size={12}>302</Text>
            </Cell>
            {/* Tx */}
            <Cell>
              <A href={`#`}>
                <ShrinkText size={12} color="blue">
                  {tx}
                </ShrinkText>
              </A>
            </Cell>
            {/* Timestamp */}
            <Cell>
              <Text size={12}>1 Sep 2023 - 01:22:31 AM +UTC</Text>
            </Cell>
            {/* Collateral */}
            <Cell>
              <Text size={12} color="green">
                +1.22
              </Text>
              <Space width="8px" />
              <TokenBadge bg="black900">
                <Text size={10} weight={800} color="white">
                  FLT
                </Text>
              </TokenBadge>
            </Cell>
            {/* Status */}
            <Cell>
              <Status color="green">
                <Text size={12} color="white" uppercase weight={800}>
                  Success
                </Text>
              </Status>
            </Cell>
          </Row>
        </RowTrigger>
      </RowHeader>
    </RowBlock>
  )
}
