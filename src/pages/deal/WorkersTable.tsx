import React from 'react'
import { useQuery } from '@tanstack/react-query'

import { A } from '../../components/A'
import { Pagination } from '../../components/Pagination'
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
  TablePagination,
} from '../../components/Table'
import { Text } from '../../components/Text'
import { usePagination } from '../../hooks'
import { peerIdContractHexToBase58 } from '../../utils/formatPeerIdHex'

import { DealJoinedWorkerFragment, getSdk } from '../../../generated/graphql'
import { graphQLClient } from '../../constants/config'

import { EmptyParameterValue } from './DealInfo'
import { RentedResourceTable } from './RentedResourceTable'

const template = ['minmax(10px, 1fr)', 'minmax(10px, 1fr)']

interface WorkersTableProps {
  dealId: string
}

export const WORKERS_PER_PAGE = 5

export const WorkersTable: React.FC<WorkersTableProps> = ({ dealId }) => {
  const pagination = usePagination(WORKERS_PER_PAGE)

  const { data, isLoading } = useQuery({
    queryKey: ['dealWorkers', dealId, pagination.page],
    queryFn: ({ queryKey: [, dealId] }) =>
      getSdk(graphQLClient).DealQuery({
        id: dealId.toString(),
        first: pagination.limit,
        skip: pagination.offset,
      }),
  })

  if (isLoading) return null

  const workers = data?.deal?.joinedWorkers

  const totalCount = data?.deal?.joinedWorkersCount?.length || 0

  const hasNextPage = pagination.offset + pagination.limit < totalCount

  return (
    <>
      <ScrollableTable>
        <TableHeader template={template}>
          <TableColumnTitle>Worker id</TableColumnTitle>
          <TableColumnTitle>Peer id</TableColumnTitle>
        </TableHeader>
        <TableBody isLoading={isLoading} skeletonCount={pagination.limit}>
          {!workers ||
            (workers?.length === 0 && (
              <EmptyParameterValue>
                <Text size={12} color="grey500">
                  No information
                </Text>
              </EmptyParameterValue>
            ))}
          {workers?.map((worker) => (
            <PeerRow key={worker.id} worker={worker} />
          ))}
        </TableBody>
      </ScrollableTable>
      <Space height="32px" />
      {totalCount > 0 && (
        <TablePagination>
          <Pagination
            pages={pagination.getTotalPages(totalCount)}
            page={pagination.page}
            hasNextPage={hasNextPage}
            onSelect={pagination.selectPage}
          />
        </TablePagination>
      )}
    </>
  )
}

interface WorkerRowProps {
  worker: DealJoinedWorkerFragment
}

const PeerRow: React.FC<WorkerRowProps> = ({ worker }) => {
  return (
    <RowBlock>
      <RowHeader>
        <RowTrigger>
          <Row template={template}>
            <Cell>
              <Text size={12}>{worker.id}</Text>
            </Cell>
            <Cell>
              <A href={`/peer/${peerIdContractHexToBase58(worker.peer.id)}`}>
                {peerIdContractHexToBase58(worker.peer.id)}
              </A>
            </Cell>
          </Row>
          {worker.resources && (
            <>
              <Space height="1rem" />
              <ContentBlock>
                <RentedResourceTable resources={worker.resources} />
              </ContentBlock>
            </>
          )}
        </RowTrigger>
      </RowHeader>
    </RowBlock>
  )
}
