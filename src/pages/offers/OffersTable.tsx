import React, { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from '@emotion/styled'
import {
  OffersFilters,
  OfferShortOrderBy,
  OrderType,
} from '@fluencelabs/deal-aurora/dist/dealExplorerClient/types/filters'
import { OfferShort } from '@fluencelabs/deal-aurora/dist/dealExplorerClient/types/schemes'
import { useLocation } from 'wouter'

import { A } from '../../components/A'
import { DetailsButton } from '../../components/DetailsButton'
import { EffectorsTooltip } from '../../components/EffectorsTooltip'
import { Pagination } from '../../components/Pagination'
import { Space } from '../../components/Space'
import {
  Cell,
  Row,
  RowBlock,
  RowHeader,
  RowTrigger,
  TableBody,
  TableColumnTitle,
  TableColumnTitleWithSort,
  TableHeader,
} from '../../components/Table'
import { ShrinkText, Text } from '../../components/Text'
import { TokenBadge } from '../../components/TokenBadge'
import { useApiQuery, usePagination } from '../../hooks'
import { formatUnixTimestamp } from '../../utils/formatUnixTimestamp'

import { colors } from '../../constants/colors'

const template = [
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  '50px',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  '70px',
]

const OFFERS_PER_PAGE = 5

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
        <TableColumnTitle>Peers</TableColumnTitle>
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
          field="pricePerWorkerEpoch"
          isActive={orderBy === 'pricePerWorkerEpoch'}
          onSort={handleSort}
        >
          Price per epoch
        </TableColumnTitleWithSort>
        <TableColumnTitle>Effectors list</TableColumnTitle>
      </TableHeader>
      <TableBody skeletonCount={OFFERS_PER_PAGE} isLoading={isLoading}>
        {pageOffers?.map((offer) => <OfferRow key={offer.id} offer={offer} />)}
      </TableBody>
      <Space height="32px" />
      <div style={{ alignSelf: 'flex-end' }}>
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
      </div>
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
              <A href={`/offer/${offer.id}`}>{offer.id}</A>
            </Cell>
            {/* Created at */}
            <Cell flexDirection="column" alignItems="flex-start">
              <Text size={12}>{createdAt.date}</Text>
              <Text size={12}>{createdAt.time}</Text>
            </Cell>
            {/* Provider */}
            <Cell>
              <A href={`/provider/${offer.providerId}`}>{offer.providerId}</A>
            </Cell>
            {/* Peers */}
            <Cell>
              <Text size={12}>{offer.peersCount}</Text>
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
              <Text size={12}>10</Text>
              <TokenBadge bg="grey200">
                <Text size={10} weight={800} color="grey500">
                  {offer.paymentToken.symbol}
                </Text>
              </TokenBadge>
            </Cell>
            {/* Effectors list */}
            <Cell>
              <ShrinkText size={12}>
                {offer.effectors.map((e) => e.description).join(', ')}
              </ShrinkText>
              <EffectorsTooltip effectors={offer.effectors} />
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
