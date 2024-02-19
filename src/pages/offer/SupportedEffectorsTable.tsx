import React from 'react'
import { Effector } from '@fluencelabs/deal-aurora/dist/dealExplorerClient/types/schemes'

import { A } from '../../components/A'
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

const template = ['30px', 'minmax(10px, 1fr)', 'minmax(10px, 1fr)']

interface SupportedEffectorsTableProps {
  effectors: Effector[]
}

export const SupportedEffectorsTable: React.FC<
  SupportedEffectorsTableProps
> = ({ effectors }) => {
  return (
    <>
      <TableHeader template={template}>
        <TableColumnTitle>#</TableColumnTitle>
        <TableColumnTitle>CID</TableColumnTitle>
        <TableColumnTitle>Description</TableColumnTitle>
      </TableHeader>
      <TableBody>
        {effectors.map((effector, index) => (
          <EffectorRow key={effector.cid} index={index} effector={effector} />
        ))}
      </TableBody>
    </>
  )
}

interface EffectorRowProps {
  index: number
  effector: Effector
}

const EffectorRow: React.FC<EffectorRowProps> = ({ index, effector }) => {
  return (
    <RowBlock>
      <RowHeader>
        <RowTrigger>
          <Row template={template}>
            {/* # */}
            <Cell>
              <Text size={12}>{index + 1}</Text>
            </Cell>
            {/* CID */}
            <Cell>
              <A href={`/deal/${effector.cid}`}>{effector.cid}</A>
            </Cell>
            {/* Description */}
            <Cell>
              <Text size={12}>{effector.description}</Text>
            </Cell>
          </Row>
        </RowTrigger>
      </RowHeader>
    </RowBlock>
  )
}
