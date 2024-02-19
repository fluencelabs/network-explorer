import React, { useState } from 'react'
import { useLocation } from 'wouter'

import { A } from '../../components/A'
import { DetailsButton } from '../../components/DetailsButton'
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
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  '70px',
]

export const ProofsTable: React.FC = () => {
  const [page, setPage] = useState(1)

  return (
    <>
      <TableHeader template={template}>
        <TableColumnTitle>Proof tx</TableColumnTitle>
        <TableColumnTitle>Timestamp</TableColumnTitle>
        <TableColumnTitle>Provider</TableColumnTitle>
        <TableColumnTitle>Capacity commitment</TableColumnTitle>
        <TableColumnTitle>Peer id</TableColumnTitle>
        <TableColumnTitle>Compute units</TableColumnTitle>
        <TableColumnTitle>Epoch</TableColumnTitle>
      </TableHeader>
      <TableBody>
        <ProofRow
          proofTx="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
          commitmentId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
          providerId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
          peerId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
          computeUnit="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
        />
        <ProofRow
          proofTx="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
          commitmentId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
          providerId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
          peerId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
          computeUnit="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
        />
        <ProofRow
          proofTx="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
          commitmentId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
          providerId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
          peerId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
          computeUnit="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
        />
        <ProofRow
          proofTx="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
          commitmentId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
          providerId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
          peerId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
          computeUnit="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
        />
        <ProofRow
          proofTx="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
          commitmentId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
          providerId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
          peerId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
          computeUnit="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
        />
        <ProofRow
          proofTx="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
          commitmentId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
          providerId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
          peerId="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
          computeUnit="5e9d7ffe-5b01-43a0-9243-782e4572f1d1"
        />
      </TableBody>
      <Space height="32px" />
      <div style={{ alignSelf: 'flex-end' }}>
        <Pagination
          pages={25}
          page={page}
          onSelect={(page) => setPage(() => page)}
        />
      </div>
    </>
  )
}

interface ProofRowProps {
  proofTx: string
  providerId: string
  commitmentId: string
  peerId: string
  computeUnit: string
}

const ProofRow: React.FC<ProofRowProps> = ({
  proofTx,
  providerId,
  commitmentId,
  peerId,
  computeUnit,
}) => {
  const [, navigate] = useLocation()

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    navigate(`/deal/${peerId}`)
  }

  return (
    <RowBlock>
      <RowHeader onClick={handleClick}>
        <RowTrigger>
          <Row template={template}>
            {/* Proof tx */}
            <Cell>
              <A href={`/offer/${proofTx}`}>{proofTx}</A>
            </Cell>
            {/* Timestamp */}
            <Cell>
              <Text size={12}>1 Sep 2023 - 01:22:31 AM +UTC</Text>
            </Cell>
            {/* Provider id */}
            <Cell>
              <A href={`/provider/${providerId}`}>{providerId}</A>
            </Cell>
            {/* Capacity commitment */}
            <Cell>
              <A href={`/capacity/${commitmentId}`}>{commitmentId}</A>
            </Cell>
            {/* Peer id */}
            <Cell>
              <A href={`/peer/${peerId}`}>{peerId}</A>
            </Cell>
            {/* Compute unit */}
            <Cell>
              <A href={`/compute-unit/${computeUnit}`}>{computeUnit}</A>
            </Cell>
            {/* Epoch */}
            <Cell>
              <Text size={12}>500</Text>
            </Cell>
            {/* Details */}
            <Cell>
              <DetailsButton
                onClick={() =>
                  navigate(`/capacity/5e9d7ffe-5b01-43a0-9243-782e4572f1d6`)
                }
              >
                <Text size={10} weight={800} uppercase>
                  Details
                </Text>
              </DetailsButton>
            </Cell>
          </Row>
        </RowTrigger>
      </RowHeader>
    </RowBlock>
  )
}
