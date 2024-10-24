/* eslint-disable react/prop-types */
import { useApiQuery } from '../../hooks'

interface ProviderPeersTableProps {
  providerId: string
}

export const ProviderPeersTable: React.FC<ProviderPeersTableProps> = ({
  providerId,
}) => {
  const { data } = useApiQuery((client) =>
    client.getPeers({ provider: providerId }),
  )

  if (!data?.data) return null

  return <PeersTable peers={data?.data} />
}

import React from 'react'
import { PeerBasic } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/schemes'

import { A } from '../../components/A'
import { CapacityStatus } from '../../components/CapacityStatus'
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

const template = [
  '20px',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  '50px',
  'minmax(10px, 1fr)',
  '80px',
]

interface PeersTableProps {
  peers: PeerBasic[]
}

export const PeersTable: React.FC<PeersTableProps> = ({ peers }) => {
  return (
    <>
      <ScrollableTable>
        <TableHeader template={template}>
          <TableColumnTitle>#</TableColumnTitle>
          <TableColumnTitle>Peer id</TableColumnTitle>
          <TableColumnTitle>Offer id</TableColumnTitle>
          <TableColumnTitle>CUs</TableColumnTitle>
          <TableColumnTitle>Current CC</TableColumnTitle>
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
  peer: PeerBasic
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
              <A href={`/peer/${peer.id}`}>{formatHexData(peer.id, 20, 20)}</A>
            </Cell>
            {/* Offer ID */}
            <Cell>
              {peer.offer?.id ? (
                <A href={`/offer/${peer.offer?.id}`}>
                  {formatHexData(peer.offer?.id, 15, 15)}
                </A>
              ) : (
                '-'
              )}
            </Cell>
            {/* Compute units */}
            <Cell>
              <Text size={12}>{peer.computeUnitsTotal}</Text>
            </Cell>
            {/* Current CC */}
            <Cell>
              {peer.currentCapacityCommitment ? (
                <A href={`/capacity/${peer.currentCapacityCommitment?.id}`}>
                  {formatHexData(peer.currentCapacityCommitment?.id, 15, 15)}
                </A>
              ) : (
                '-'
              )}
            </Cell>
            {/* Status */}
            <Cell>
              {peer.currentCapacityCommitment?.status && (
                <CapacityStatus
                  status={peer.currentCapacityCommitment?.status}
                />
              )}
            </Cell>
          </Row>
        </RowTrigger>
      </RowHeader>
    </RowBlock>
  )
}
