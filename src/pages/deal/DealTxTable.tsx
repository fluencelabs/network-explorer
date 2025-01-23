import React from 'react'
import { useQuery } from '@tanstack/react-query'

import { A } from '../../components/A'
import { Pagination } from '../../components/Pagination'
import { Space } from '../../components/Space'
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
  TablePagination,
} from '../../components/Table'
import { Text, TextWithIcon } from '../../components/Text'
import { TokenBadge } from '../../components/TokenBadge'
import { usePagination } from '../../hooks'
import { formatUSDcTokenValue } from '../../utils'
import { formatUnixTimestamp } from '../../utils/formatUnixTimestamp'
import { formatHexData } from '../../utils/helpers'

import { BLOCKSCOUT_URL, graphQLClient } from '../../constants/config'
import { getSdk } from '../../generated/graphql'

const template = [
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  '100px',
]

export const DealTxTable: React.FC<{ dealId: string }> = ({ dealId }) => {
  const { data, isLoading } = useQuery({
    queryKey: ['dealTx', dealId],
    queryFn: ({ queryKey: [, dealId] }) =>
      getSdk(graphQLClient).DealBalanceTxesQuery({
        filters: { deal_: { id: dealId } },
      }),
  })

  const pagination = usePagination(5)

  if (isLoading || !data) return null

  const hasNextPage =
    data.data.dealBalanceTxes &&
    data.data.dealBalanceTxes.length > pagination.limit

  return (
    <>
      <ScrollableTable>
        <TableHeader template={template}>
          <TableColumnTitle>Tx</TableColumnTitle>
          <TableColumnTitle>Time</TableColumnTitle>
          <TableColumnTitle>Amount</TableColumnTitle>
          <TableColumnTitle></TableColumnTitle>
        </TableHeader>
        <TableBody>
          {data.data.dealBalanceTxes.map((data, index) => (
            <TransactionRow key={String(index)} {...data} />
          ))}
        </TableBody>
      </ScrollableTable>
      <Space height="32px" />
      <TablePagination>
        <Pagination
          pages={pagination.getTotalPages(data.data.dealBalanceTxes.length)}
          page={pagination.page}
          hasNextPage={hasNextPage}
          onSelect={pagination.selectPage}
        />
      </TablePagination>
    </>
  )
}

const TransactionRow: React.FC<{
  user: string
  type: number
  tx: string
  timestamp: number
  id: string
  amount: number
}> = ({ amount, tx, timestamp, type }) => {
  const { date, time } = formatUnixTimestamp(timestamp)

  return (
    <RowBlock>
      <RowHeader>
        <RowTrigger>
          <Row template={template}>
            <Cell>
              <A href={BLOCKSCOUT_URL + `tx/${tx}`}>{formatHexData(tx)}</A>
            </Cell>
            <Cell>
              <Text size={12}>
                {date} {time}
              </Text>
            </Cell>
            <Cell>
              <TextWithIcon>
                <Text size={12}>{formatUSDcTokenValue(BigInt(amount))}</Text>
                <TokenBadge bg="grey200">
                  <Text size={10} weight={800} color="grey500">
                    tUSDC
                  </Text>
                </TokenBadge>
              </TextWithIcon>
            </Cell>
            <Cell>
              <Text size={12}>{type === 0 ? 'In ⟹' : 'Out ⟸'}</Text>
            </Cell>
          </Row>
        </RowTrigger>
      </RowHeader>
    </RowBlock>
  )
}
