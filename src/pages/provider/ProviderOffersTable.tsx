import React, { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from '@emotion/styled'
import {
  OfferShortOrderBy,
  OrderType,
} from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/filters'
import { OfferShort } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/schemes'
import { useLocation } from 'wouter'

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
  TableColumnTitleWithSort,
  TableHeader,
  TablePagination,
} from '../../components/Table'
import { Text } from '../../components/Text'
import { TokenBadge } from '../../components/TokenBadge'
import { useApiQuery, usePagination } from '../../hooks'
import { formatUSDcTokenValue } from '../../utils'
import { formatUnixTimestamp } from '../../utils/formatUnixTimestamp'
import { formatHexData } from '../../utils/helpers'

import { colors } from '../../constants/colors'

const template = [
  'minmax(10px, 200px)',
  'minmax(10px, 120px)',
  'minmax(10px, 200px)',
  'minmax(10px, 1fr)',
  '100px',
]

interface ProviderOffersTableProps {
  providerId: string
}

const PROVIDER_OFFERS_PER_PAGE = 6

type ProviderOfferSort = `${OfferShortOrderBy}:${OrderType}`

export const ProviderOffersTable: React.FC<ProviderOffersTableProps> = ({
  providerId,
}) => {
  const [order, setOrder] = useState<ProviderOfferSort>('createdAt:desc')
  const [orderBy, orderType] = order.split(':') as [
    OfferShortOrderBy,
    OrderType,
  ]

  const { page, selectPage, limit, offset, getTotalPages } = usePagination(
    PROVIDER_OFFERS_PER_PAGE,
  )

  const { data: offers, isLoading } = useApiQuery(
    (client) =>
      client.getOffersByProvider(
        { providerId },
        offset,
        limit + 1,
        orderBy,
        orderType,
      ),
    [page, orderBy, orderType, providerId],
    {
      key: `provider-offers:${JSON.stringify({
        providerId,
        offset,
        limit,
        order,
        orderBy,
      })}`,
      ttl: 1_000 * 60, // 1 minute
    },
  )

  const hasNextPage = offers && offers.data.length > limit
  const pageOffers = offers && offers.data.slice(0, limit)

  const handleSort = (key: OfferShortOrderBy, order: OrderType) => {
    setOrder(`${key}:${order}`)
  }

  return (
    <>
      <Text size={32}>Offers</Text>
      <Space height="32px" />
      <ScrollableTable>
        <TableHeader template={template}>
          <TableColumnTitle>Offer Id</TableColumnTitle>
          <TableColumnTitleWithSort
            order={orderType}
            field="createdAt"
            isActive={orderBy === 'createdAt'}
            onSort={handleSort}
          >
            Created At
          </TableColumnTitleWithSort>
          <TableColumnTitle>Total peers (Confirmed)</TableColumnTitle>
          <TableColumnTitle>
            Compute Units{' '}
            <Text size={10} weight={500} color="green" uppercase>
              ( Available )
            </Text>
          </TableColumnTitle>
          <TableColumnTitleWithSort
            order={orderType}
            field="pricePerCuPerEpoch"
            isActive={orderBy === 'pricePerCuPerEpoch'}
            onSort={handleSort}
          >
            Price Per Epoch
          </TableColumnTitleWithSort>
        </TableHeader>
        <TableBody
          skeletonCount={PROVIDER_OFFERS_PER_PAGE}
          isLoading={isLoading}
        >
          {pageOffers?.map((offer) => (
            <OfferRow key={offer.id} offer={offer} />
          ))}
        </TableBody>
      </ScrollableTable>
      <Space height="32px" />
      <TablePagination>
        {!offers ? (
          <Skeleton width={200} height={34} count={1} />
        ) : (
          <Pagination
            pages={getTotalPages(offers.total)}
            page={page}
            hasNextPage={hasNextPage}
            onSelect={selectPage}
          />
        )}
      </TablePagination>
    </>
  )
}

interface OfferRowProps {
  offer: OfferShort
}

const OfferRow: React.FC<OfferRowProps> = ({ offer }) => {
  const [, navigate] = useLocation()

  const createdAt = formatUnixTimestamp(offer.createdAt)

  return (
    <RowBlock>
      <RowHeader onClick={() => navigate(`/offer/${offer.id}`)}>
        <RowTrigger>
          <Row template={template}>
            {/* Offer Id */}
            <Cell>
              <A href={`/offer/${offer.id}`}>
                {formatHexData(offer.id, 8, 10)}
              </A>
            </Cell>
            {/* Created At */}
            <Cell flexDirection="column" alignItems="flex-start">
              <Text size={12}>{createdAt.date}</Text>
              <Text size={12}>{createdAt.time}</Text>
            </Cell>
            {/* Peers */}
            <Cell>
              <Text size={12}>{offer.peersCount}</Text>
              <Space width="6px" />
              <ProviderComputeUnitsAvailable size={12} color="white">
                {offer.peersInActiveCCCount}
              </ProviderComputeUnitsAvailable>
            </Cell>
            {/* Compute Units */}
            <Cell>
              <Text size={12}>{offer.totalComputeUnits}</Text>
              <Space width="6px" />
              <ProviderComputeUnitsAvailable size={12} color="white">
                {offer.freeComputeUnits}
              </ProviderComputeUnitsAvailable>
            </Cell>
            {/* Price Per Epoch */}
            <Cell gap="8px">
              <Text size={12}>{formatUSDcTokenValue(offer.pricePerEpoch)}</Text>
              <TokenBadge bg="grey200">
                <Text size={10} weight={800} color="grey500">
                  {offer.paymentToken.symbol}
                </Text>
              </TokenBadge>
            </Cell>
          </Row>
        </RowTrigger>
      </RowHeader>
    </RowBlock>
  )
}

const ProviderComputeUnitsAvailable = styled(Text)`
  background-color: ${colors.green};
  padding: 1px 6px;
  border-radius: 100px;
`
