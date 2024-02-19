import React from 'react'

import { A } from '../../components/A'
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
import { ShrinkText, Text } from '../../components/Text'

const template = [
  '20px',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
]

export const MatchingTable: React.FC = () => {
  return (
    <>
      <TableHeader template={template}>
        <TableColumnTitle>#</TableColumnTitle>
        <TableColumnTitle>Provider Id</TableColumnTitle>
        <TableColumnTitle>Compute Unit</TableColumnTitle>
        <TableColumnTitle>Worker Id</TableColumnTitle>
        <TableColumnTitle>Worker Status</TableColumnTitle>
      </TableHeader>
      <TableBody>
        <PeerRow
          providerId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
          computeUnit="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
          workerId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
        />
        <PeerRow
          providerId="5e9d7ffe-5b01-43a0-9243-782e4572f1d2"
          computeUnit="5e9d7ffe-5b01-43a0-9243-782e4572f1d2"
          workerId="5e9d7ffe-5b01-43a0-9243-782e4572f1d2"
        />
        <PeerRow
          providerId="5e9d7ffe-5b01-43a0-9243-782e4572f1d3"
          computeUnit="5e9d7ffe-5b01-43a0-9243-782e4572f1d3"
          workerId="5e9d7ffe-5b01-43a0-9243-782e4572f1d3"
        />
        <PeerRow
          providerId="5e9d7ffe-5b01-43a0-9243-782e4572f1d4"
          computeUnit="5e9d7ffe-5b01-43a0-9243-782e4572f1d4"
          workerId="5e9d7ffe-5b01-43a0-9243-782e4572f1d4"
        />
        <PeerRow
          providerId="5e9d7ffe-5b01-43a0-9243-782e4572f1d5"
          computeUnit="5e9d7ffe-5b01-43a0-9243-782e4572f1d5"
          workerId="5e9d7ffe-5b01-43a0-9243-782e4572f1d5"
        />
        <PeerRow
          providerId="5e9d7ffe-5b01-43a0-9243-782e4572f1d6"
          computeUnit="5e9d7ffe-5b01-43a0-9243-782e4572f1d6"
          workerId="5e9d7ffe-5b01-43a0-9243-782e4572f1d6"
        />
      </TableBody>
    </>
  )
}

interface PeerRowProps {
  providerId: string
  computeUnit: string
  workerId: string
}

const PeerRow: React.FC<PeerRowProps> = ({
  providerId,
  computeUnit,
  workerId,
}) => {
  return (
    <RowBlock>
      <RowHeader>
        <RowTrigger>
          <Row template={template}>
            {/* # */}
            <Cell>
              <Text size={12}>1</Text>
            </Cell>
            {/* Provider ID */}
            <Cell>
              <A href={`/provider/${providerId}`}>{providerId}</A>
            </Cell>
            {/* Compute Unit */}
            <Cell>
              <ShrinkText size={12}>{computeUnit}</ShrinkText>
            </Cell>
            {/* Worker Id  */}
            <Cell>
              <ShrinkText size={12}>{workerId}</ShrinkText>
            </Cell>
            {/* Status */}
            <Cell>
              <Status type="label" color="blue">
                <Text uppercase size={10} weight={800} color="white">
                  Registered
                </Text>
              </Status>
            </Cell>
          </Row>
        </RowTrigger>
      </RowHeader>
    </RowBlock>
  )
}
