import React from 'react'
import styled from '@emotion/styled'
import { DealShort } from '@fluencelabs/deal-aurora/dist/dealExplorerClient/types/schemes'
import { useLocation } from 'wouter'

import { InfoOutlineIcon } from '../../assets/icons'
import { A } from '../../components/A'
import { DealStatus } from '../../components/DealStatus'
import { DetailsButton } from '../../components/DetailsButton'
import {
  Cell,
  HeaderCellWithTooltip,
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
import { TokenBadge } from '../../components/TokenBadge'
import { Tooltip } from '../../components/Tooltip'
import { useApiQuery } from '../../hooks'

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

interface ProviderDealsTableProps {
  providerId: string
}

export const ProviderDealsTable: React.FC<ProviderDealsTableProps> = ({
  providerId,
}) => {
  const { data: deals, isLoading } = useApiQuery((client) =>
    client.getDealsByProvider({
      providerId,
    }),
  )

  return (
    <>
      <ScrollableTable>
        <TableHeader template={template}>
          <HeaderCellWithTooltip>
            <TableColumnTitle>Deal Id</TableColumnTitle>
            <Tooltip trigger={<InfoOutlineIcon />}>
              <Text color="grey600" weight={600}>
                Test
              </Text>
            </Tooltip>
          </HeaderCellWithTooltip>
          <TableColumnTitle>Matched at</TableColumnTitle>
          <HeaderCellWithTooltip>
            <TableColumnTitle>Offer Id</TableColumnTitle>
            <Tooltip trigger={<InfoOutlineIcon />}>
              <Text color="grey600" weight={600}>
                Test
              </Text>
            </Tooltip>
          </HeaderCellWithTooltip>
          <TableColumnTitle>Payment Token</TableColumnTitle>
          <TableColumnTitle>Matched Compute Units</TableColumnTitle>
          <TableColumnTitle>Active Workers</TableColumnTitle>
          <TableColumnTitle>Status</TableColumnTitle>
        </TableHeader>
        <TableBody isLoading={isLoading}>
          {deals?.data.map((deal) => <DealRow key={deal.id} deal={deal} />)}
        </TableBody>
      </ScrollableTable>
    </>
  )
}

interface DealRowProps {
  deal: DealShort
}

const DealRow: React.FC<DealRowProps> = ({ deal }) => {
  const [, navigate] = useLocation()
  return (
    <RowBlock>
      <RowHeader>
        <RowTrigger>
          <Row template={template}>
            <Cell>
              <A href={`/deal/${deal.id}`}>{deal.id}</A>
            </Cell>
            <Cell>
              <Column>
                <Text size={12}>1 Sep 2023</Text>
                <Text size={12}>06:07:59 AM +UTC</Text>
              </Column>
            </Cell>
            <Cell>
              <A href={`/offer/${deal.client}`}>{deal.client}</A>
            </Cell>
            <Cell>
              <TokenBadge bg="grey200">
                <Text size={10} weight={800} color="grey500">
                  {deal.paymentToken.symbol}
                </Text>
              </TokenBadge>
            </Cell>
            <Cell>
              <Text size={12}>2</Text>
            </Cell>
            <Cell>
              <Text size={12}>2</Text>
            </Cell>
            <Cell>
              <DealStatus status={deal.status} />
            </Cell>
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

const Column = styled.div`
  display: flex;
  flex-direction: column;
`
