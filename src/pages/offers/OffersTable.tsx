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
  TableHeader,
  TablePagination,
} from '../../components/Table'
import { Text } from '../../components/Text'
import { useApiQuery, usePagination } from '../../hooks'
import { formatHexData } from '../../utils/helpers'

import { colors } from '../../constants/colors'

const template = [
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
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
  const [order] = useState<OfferSort>('createdAt:desc')
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

  return (
    <>
      <ScrollableTable>
        <TableHeader template={template}>
          <TableColumnTitle>Offer Id</TableColumnTitle>
          <TableColumnTitle>Provider</TableColumnTitle>
          <TableColumnTitle>Total peers (Confirmed)</TableColumnTitle>
          <TableColumnTitle>CCP CUs</TableColumnTitle>
          <TableColumnTitle>Deal CUs</TableColumnTitle>
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

  return (
    <RowBlock>
      <RowHeader onClick={handleClick}>
        <RowTrigger>
          <Row template={template}>
            <Cell>
              <A href={`/offer/${offer.id}`}>
                {formatHexData(offer.id, 8, 10)}
              </A>
            </Cell>
            <Cell>
              <A href={`/provider/${offer.providerId}`}>
                {formatHexData(offer.providerId, 8, 10)}
              </A>
            </Cell>
            <Cell>
              <Text size={12}>{offer.peersCount}</Text>
              <Space width="6px" />
              <ProviderComputeUnitsAvailable size={12} color="white">
                {offer.peersInActiveCCCount}
              </ProviderComputeUnitsAvailable>
            </Cell>
            <Cell>
              <Text size={12}>{offer.computeUnitsInCapacityCommitment}</Text>
            </Cell>
            <Cell>
              <Text size={12}>{offer.computeUnitsInDeal}</Text>
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
