import React from 'react'
import { PaymentToken } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/schemes'
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
import { formatTokenValue } from '../../utils'
import { formatUnixTimestamp } from '../../utils/formatUnixTimestamp'
import { formatHexData } from '../../utils/helpers'

import { getSdk } from '../../../generated/graphql'
import { BLOCKSCOUT_URL, graphQLClient } from '../../constants/config'

const template = [
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  '100px',
]

export const DealTxTable: React.FC<{
  dealId: string
  paymentToken: PaymentToken
}> = ({ dealId, paymentToken }) => {
  const pagination = usePagination(5)

  const { data, isLoading } = useQuery({
    queryKey: ['dealTx', dealId],
    queryFn: ({ queryKey: [, dealId] }) =>
      getSdk(graphQLClient).DealBalanceTxesQuery({
        filters: { deal_: { id: dealId } },
        skip: pagination.page * pagination.limit,
        first: pagination.limit,
      }),
  })

  if (isLoading || !data) return null

  const hasNextPage =
    data.dealBalanceTxes && data.dealBalanceTxes.length > pagination.limit

  return (
    <>
      <ScrollableTable>
        <TableHeader template={template}>
          <TableColumnTitle>Tx</TableColumnTitle>
          <TableColumnTitle>Time</TableColumnTitle>
          <TableColumnTitle>Amount</TableColumnTitle>
          <TableColumnTitle></TableColumnTitle>
        </TableHeader>
        <TableBody isEmpty={data.dealBalanceTxes.length === 0}>
          {data.dealBalanceTxes.map((data, index) => (
            <TransactionRow
              paymentToken={paymentToken}
              key={String(index)}
              {...data}
            />
          ))}
        </TableBody>
      </ScrollableTable>
      <Space height="32px" />
      <TablePagination>
        <Pagination
          pages={pagination.getTotalPages(data.dealBalanceTxes.length)}
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
  timestamp: string
  id: string
  amount: string
  paymentToken: PaymentToken
}> = ({ amount, tx, timestamp, type, paymentToken }) => {
  const { date, time } = formatUnixTimestamp(new Date(timestamp).valueOf())

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
                <Text size={12}>
                  {formatTokenValue(
                    BigInt(amount),
                    Number(paymentToken.decimals),
                  )}
                </Text>
                <TokenBadge bg="grey200">
                  <Text size={10} weight={800} color="grey500">
                    {paymentToken.symbol}
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
