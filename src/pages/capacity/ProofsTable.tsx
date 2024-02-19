import React, { useState } from 'react'

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
import { TokenBadge } from '../../components/TokenBadge'

const template = [
  '30px',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
]

export const ProofsTable: React.FC = () => {
  const [page, setPage] = useState(1)

  return (
    <>
      <TableHeader template={template}>
        <TableColumnTitle>Epoch</TableColumnTitle>
        <TableColumnTitle>Epoch period (blocks)</TableColumnTitle>
        <TableColumnTitle>Expected Number of CUs</TableColumnTitle>
        <TableColumnTitle>Submitted proofs / fails</TableColumnTitle>
        <TableColumnTitle>Average proofs per cu</TableColumnTitle>
        <TableColumnTitle>Awards</TableColumnTitle>
      </TableHeader>
      <TableBody>
        <ProofRow />
        <ProofRow />
        <ProofRow />
        <ProofRow />
        <ProofRow />
        <ProofRow />
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

const ProofRow: React.FC = () => {
  return (
    <RowBlock>
      <RowHeader>
        <RowTrigger>
          <Row template={template}>
            {/* Epoch */}
            <Cell>
              <Text size={12}>302</Text>
            </Cell>
            {/* Epoch period (blocks) */}
            <Cell>
              <Text size={12}>102121 - 102191</Text>
            </Cell>
            {/* Expected Number of CUs */}
            <Cell>
              <Text size={12}>106</Text>
            </Cell>
            {/* Submitted proofs / fails */}
            <Cell>
              <Text size={12} color={'green'}>
                106
              </Text>
              <Text size={12}>&nbsp;/&nbsp;</Text>
              <Text size={12} color={'red'}>
                0
              </Text>
            </Cell>
            {/* Average proofs per cu units */}
            <Cell>
              <Text size={12}>1</Text>
            </Cell>
            {/* Awards */}
            <Cell>
              <Text size={12}>22</Text>
              <Space width="8px" />
              <TokenBadge bg="black900">
                <Text size={10} weight={800} color="white">
                  FLT
                </Text>
              </TokenBadge>
            </Cell>
          </Row>
        </RowTrigger>
      </RowHeader>
    </RowBlock>
  )
}
