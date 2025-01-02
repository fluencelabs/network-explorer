import React from 'react'
import { CapacityCommitmentStatus } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/indexerClient/generated.types'

import { A } from '../../components/A'
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

import { ResourceTable } from './ResourceTable'

const template = [
  '20px',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  '100px',
  '80px',
]

interface WorkersTableProps {
  workers?:
    | {
        id: string
        peer: {
          id: string
          resources?:
            | {
                id: string
                details: string
                resource?: {
                  metadata: string
                  type: number
                  id: string
                }
              }[]
            | null
        }
      }[]
    | null
}

export const PeersTable: React.FC<WorkersTableProps> = ({ workers }) => {
  return (
    <>
      <ScrollableTable>
        <TableHeader template={template}>
          <TableColumnTitle>#</TableColumnTitle>
          <TableColumnTitle>Worker id</TableColumnTitle>
          <TableColumnTitle>Peer id</TableColumnTitle>
        </TableHeader>
        <TableBody>
          {workers?.map((worker, index) => (
            <PeerRow key={worker.id} index={index} worker={worker} />
          ))}
        </TableBody>
      </ScrollableTable>
    </>
  )
}

interface WorkerRowProps {
  index: number
  worker: {
    id: string
    peer: {
      id: string
      currentCapacityCommitment?: {
        id: string
        status: CapacityCommitmentStatus
      } | null
      resources?:
        | {
            id: string
            details: string
            resource?: {
              metadata: string
              type: number
              id: string
            }
          }[]
        | null
    }
  }
}

const PeerRow: React.FC<WorkerRowProps> = ({ index, worker }) => {
  return (
    <RowBlock>
      <RowHeader>
        <RowTrigger>
          <Row template={template}>
            <Cell>
              <Text size={12}>{index + 1}</Text>
            </Cell>
            <Cell>
              <Text size={12}>{worker.id}</Text>
            </Cell>
            <Cell>
              <A href={`/peer/${worker.peer.id}`}>{worker.peer.id}</A>
            </Cell>
          </Row>
          {worker.peer.resources && (
            <>
              <Space height="1rem" />
              <ContentBlock>
                <ResourceTable resources={worker.peer.resources} />
              </ContentBlock>
            </>
          )}
        </RowTrigger>
      </RowHeader>
    </RowBlock>
  )
}
