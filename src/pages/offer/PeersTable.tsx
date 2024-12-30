import React from 'react'
import { Peer } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/schemes'

import { A } from '../../components/A'
import { CapacityStatus } from '../../components/CapacityStatus'
import { Space } from '../../components/Space'
import {
  Cell,
  ContentBlock,
  Row,
  RowBlock,
  RowHeader,
  RowTrigger,
  ScrollableTable,
  TableBody,
  TableColumnTitle,
  TableHeader,
} from '../../components/Table'
import { Text } from '../../components/Text'
import { formatHexData } from '../../utils/helpers'

import { ResourceTable } from './ResourceTable'

const template = [
  '20px',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  '100px',
  '80px',
]

interface PeersTableProps {
  peers: Peer[]
}

export const PeersTable: React.FC<PeersTableProps> = ({ peers }) => {
  return (
    <>
      <ScrollableTable>
        <TableHeader template={template}>
          <TableColumnTitle>#</TableColumnTitle>
          <TableColumnTitle>Peer id</TableColumnTitle>
          <TableColumnTitle>Current Capacity Commitment</TableColumnTitle>
          <TableColumnTitle>Compute units</TableColumnTitle>
          <TableColumnTitle>Status</TableColumnTitle>
        </TableHeader>
        <TableBody>
          {peers.map((peer, index) => (
            <PeerRow key={peer.id} index={index} peer={peer} />
          ))}
        </TableBody>
      </ScrollableTable>
    </>
  )
}

interface PeerRowProps {
  index: number
  peer: Peer
}

const PeerRow: React.FC<PeerRowProps> = ({ index, peer }) => {
  return (
    <RowBlock>
      <RowHeader>
        <RowTrigger>
          <Row template={template}>
            <Cell>
              <Text size={12}>{index + 1}</Text>
            </Cell>
            <Cell>
              <A href={`/peer/${peer.id}`}>{peer.id}</A>
            </Cell>
            <Cell>
              {peer.currentCapacityCommitment ? (
                <A href={`/capacity/${peer.currentCapacityCommitment.id}`}>
                  {formatHexData(peer.currentCapacityCommitment.id, 15, 15)}
                </A>
              ) : (
                '-'
              )}
            </Cell>
            <Cell>
              <Text size={12}>{peer.computeUnitsTotal}</Text>
            </Cell>
            <Cell>
              {peer.currentCapacityCommitment?.status ? (
                <CapacityStatus
                  status={peer.currentCapacityCommitment.status}
                />
              ) : (
                '-'
              )}
            </Cell>
          </Row>

          {peer.resources && (
            <>
              <Space height="1rem" />
              <ContentBlock>
                <ResourceTable resources={peer.resources} />
              </ContentBlock>
            </>
          )}
        </RowTrigger>
      </RowHeader>
    </RowBlock>
  )
}
