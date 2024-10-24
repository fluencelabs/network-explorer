import React from 'react'
import { Peer } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/schemes'

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
import { Text } from '../../components/Text'
import { formatHexData } from '../../utils/helpers'

const template = ['20px', 'minmax(10px, 1fr)', '100px', 'minmax(10px, 1fr)']

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
          <TableColumnTitle>Compute units</TableColumnTitle>
          <TableColumnTitle>Current Capacity Commitment</TableColumnTitle>
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
            {/* # */}
            <Cell>
              <Text size={12}>{index + 1}</Text>
            </Cell>
            {/* Peer ID */}
            <Cell>
              <A href={`/peer/${peer.id}`}>{peer.id}</A>
            </Cell>
            {/* Compute units */}
            <Cell>
              <Text size={12}>{peer.computeUnits.length}</Text>
            </Cell>
            {/* Current Capacity Commitment */}
            <Cell>
              {peer.currentCapacityCommitmentId ? (
                <A href={`/capacity/${peer.currentCapacityCommitmentId}`}>
                  {formatHexData(peer.currentCapacityCommitmentId, 20, 20)}
                </A>
              ) : (
                <Text size={12}>-</Text>
              )}
            </Cell>
          </Row>
        </RowTrigger>
      </RowHeader>
    </RowBlock>
  )
}
