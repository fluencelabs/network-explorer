import React, { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from '@emotion/styled'
import {
  OffersFilters,
  OfferShortOrderBy,
  OrderType,
} from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/filters'
import { OfferShort } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/schemes'
import { useLocation } from 'wouter'

import { A } from '../../components/A'
import { DetailsButton } from '../../components/DetailsButton'
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
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  '180px',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  '70px',
]

const OFFERS_PER_PAGE = 15

type OfferSort = `${OfferShortOrderBy}:${OrderType}`

interface OffersTableProps {
  filters?: OffersFilters
}

export const OffersTable: React.FC<OffersTableProps> = ({ filters }) => {
  const [order, setOrder] = useState<OfferSort>('createdAt:desc')
  const [orderBy, orderType] = order.split(':') as [
    OfferShortOrderBy,
    OrderType,
  ]

  const { page, selectPage, limit, offset, getTotalPages } =
    usePagination(OFFERS_PER_PAGE)

  const { data: offers, isLoading } = useApiQuery(
    (client) =>
      client.getOffers(filters, offset, limit + 1, orderBy, orderType),
    [page, orderBy, orderType, filters],
    {
      key: `offers:${JSON.stringify({
        filters,
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
          <TableColumnTitle>Provider</TableColumnTitle>
          <TableColumnTitle>Total peers (Confirmed)</TableColumnTitle>
          <TableColumnTitleWithSort
            order={orderType}
            field="updatedAt" // TODO
            isActive={orderBy === 'updatedAt'}
            onSort={handleSort}
          >
            Compute units{' '}
            <Text size={10} weight={500} color="green" uppercase>
              ( Available )
            </Text>
          </TableColumnTitleWithSort>
          <TableColumnTitleWithSort
            order={orderType}
            field="pricePerCuPerEpoch"
            isActive={orderBy === 'pricePerCuPerEpoch'}
            onSort={handleSort}
          >
            Price per epoch
          </TableColumnTitleWithSort>
        </TableHeader>
        <TableBody skeletonCount={OFFERS_PER_PAGE} isLoading={isLoading}>
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

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    navigate(`/offer/${offer.id}`)
  }

  const createdAt = formatUnixTimestamp(offer.createdAt)

  return (
    <RowBlock>
      <RowHeader onClick={handleClick}>
        <RowTrigger>
          <Row template={template}>
            {/* Offer Id */}
            <Cell>
              <A href={`/offer/${offer.id}`}>
                {formatHexData(offer.id, 8, 10)}
              </A>
            </Cell>
            {/* Created at */}
            <Cell flexDirection="column" alignItems="flex-start">
              <Text size={12}>{createdAt.date}</Text>
              <Text size={12}>{createdAt.time}</Text>
            </Cell>
            {/* Provider */}
            <Cell>
              <A href={`/provider/${offer.providerId}`}>
                {formatHexData(offer.providerId, 8, 10)}
              </A>
            </Cell>
            {/* Peers */}
            <Cell>
              <Text size={12}>{offer.peersCount}</Text>
              <Space width="6px" />
              <ProviderComputeUnitsAvailable size={12} color="white">
                {offer.peersInActiveCCCount}
              </ProviderComputeUnitsAvailable>
            </Cell>
            {/* Compute units */}
            <Cell>
              <Text size={12}>{offer.totalComputeUnits}</Text>
              <Space width="6px" />
              <ProviderComputeUnitsAvailable size={12} color="white">
                {offer.freeComputeUnits}
              </ProviderComputeUnitsAvailable>
            </Cell>
            {/* Price per epoch */}
            <Cell gap="8px">
              <Text size={12}>{formatUSDcTokenValue(offer.pricePerEpoch)}</Text>
              <TokenBadge bg="grey200">
                <Text size={10} weight={800} color="grey500">
                  {offer.paymentToken.symbol}
                </Text>
              </TokenBadge>
            </Cell>
            <Cell>
              <DetailsButton>
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

const ProviderComputeUnitsAvailable = styled(Text)`
  background-color: ${colors.green};
  padding: 1px 6px;
  border-radius: 100px;
`
