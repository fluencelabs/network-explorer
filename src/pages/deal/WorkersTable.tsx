import React, { useMemo } from 'react'
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

import { EmptyParameterValue } from './DealInfo'
import { RentedResourceTable } from './RentedResourceTable'

const template = ['minmax(10px, 1fr)', 'minmax(10px, 1fr)']

interface WorkersTableProps {
  dealId: string
  resources: {
    id: string
    type: number
    quantity: string
    metadata?: string
  }[]
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

export const WorkersTable: React.FC<WorkersTableProps> = ({
  dealId,
  workers,
  resources,
}) => {
  return (
    <>
      <ScrollableTable>
        <TableHeader template={template}>
          <TableColumnTitle>Worker id</TableColumnTitle>
          <TableColumnTitle>Peer id</TableColumnTitle>
        </TableHeader>
        <TableBody>
          {!workers ||
            (workers?.length === 0 && (
              <EmptyParameterValue>
                <Text size={12} color="grey500">
                  No information
                </Text>
              </EmptyParameterValue>
            ))}
          {workers?.map((worker, index) => (
            <PeerRow
              dealId={dealId}
              key={worker.id}
              index={index}
              worker={worker}
              resources={resources}
            />
          ))}
        </TableBody>
      </ScrollableTable>
    </>
  )
}

interface WorkerRowProps {
  dealId: string
  resources: {
    id: string
    type: number
    quantity: string
    metadata?: string
  }[]
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

const PeerRow: React.FC<WorkerRowProps> = ({ dealId, worker, resources }) => {
  // An array of resources augmented with corresponding details from worker.peer.resources
  const resourceWithDetails = useMemo(() => {
    const resourceIdToDetails = new Map(
      worker.peer.resources?.map((resource) => [
        resource.id.replace(worker.peer.id, ''),
        resource.details,
      ]),
    )

    return resources.map((resource) => ({
      ...resource,
      details: resourceIdToDetails.get(resource.id.replace(dealId, '')),
    }))
  }, [dealId, worker.peer, resources])

  return (
    <RowBlock>
      <RowHeader>
        <RowTrigger>
          <Row template={template}>
            <Cell>
              <Text size={12}>{worker.id}</Text>
            </Cell>
            <Cell>
              <A href={`/peer/${worker.peer.id}`}>{worker.peer.id}</A>
            </Cell>
          </Row>
          {resourceWithDetails && (
            <>
              <Space height="1rem" />
              <ContentBlock>
                <RentedResourceTable resources={resourceWithDetails} />
              </ContentBlock>
            </>
          )}
        </RowTrigger>
      </RowHeader>
    </RowBlock>
  )
}
