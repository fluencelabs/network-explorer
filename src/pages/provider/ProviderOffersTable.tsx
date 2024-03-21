import React, { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from '@emotion/styled'
import {
  ChildEntitiesByProviderFilter,
  OfferShortOrderBy,
  OrderType,
  ProviderChildEntityStatusFilter,
} from '@fluencelabs/deal-aurora/dist/dealExplorerClient/types/filters'
import { useLocation } from 'wouter'

import { A } from '../../components/A'
import { ButtonGroup } from '../../components/ButtonGroup'
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
  ScrollableTable,
  TableBody,
  TableColumnTitle,
  TableColumnTitleWithSort,
  TableHeader,
  TablePagination,
} from '../../components/Table'
import { ShrinkText, Text } from '../../components/Text'
import { TokenBadge } from '../../components/TokenBadge'
import { useApiQuery, usePagination } from '../../hooks'
import { useFilters } from '../../hooks/useFilters'
import { formatUnixTimestamp } from '../../utils/formatUnixTimestamp'

import { OfferShort } from '../../client/types/schemes.ts'
import { colors } from '../../constants/colors'

const template = [
  'minmax(10px, 200px)',
  'minmax(10px, 120px)',
  'minmax(10px, 60px)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(50px, 1fr)',
  '70px',
]

interface ProviderOffersTableProps {
  providerId: string
}

const PROVIDER_OFFERS_PER_PAGE = 6

type ProviderOfferSort = `${OfferShortOrderBy}:${OrderType}`

const items: {
  value: ProviderChildEntityStatusFilter | 'all'
  label: string
}[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

export const ProviderOffersTable: React.FC<ProviderOffersTableProps> = ({
  providerId,
}) => {
  const [filters, setFilter] = useFilters<ChildEntitiesByProviderFilter>({
    providerId,
  })

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
        filters,
        offset,
        limit + 1,
        orderBy,
        orderType,
      ),
    [page, orderBy, orderType, filters],
    {
      key: `provider-offers:${JSON.stringify({
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

  const handleSetStatus = (value: ProviderChildEntityStatusFilter) => {
    setFilter('status', value)
  }

  return (
    <>
      <Text size={32}>Offers</Text>
      <Space height="24px" />
      <ButtonGroup
        value={filters.status ?? 'all'}
        onSelect={handleSetStatus}
        items={items}
      />
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
          <TableColumnTitle>Peers</TableColumnTitle>
          <TableColumnTitle>
            Compute Units{' '}
            <Text size={10} weight={500} color="green" uppercase>
              ( Available )
            </Text>
          </TableColumnTitle>
          <TableColumnTitleWithSort
            order={orderType}
            field="pricePerWorkerEpoch"
            isActive={orderBy === 'pricePerWorkerEpoch'}
            onSort={handleSort}
          >
            Price Per Epoch
          </TableColumnTitleWithSort>
          <TableColumnTitle>Effectors List</TableColumnTitle>
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
      <RowHeader>
        <RowTrigger>
          <Row template={template}>
            {/* Offer Id */}
            <Cell>
              <A href={`/offer/${offer.id}`}>{offer.id}</A>
            </Cell>
            {/* Created At */}
            <Cell flexDirection="column" alignItems="flex-start">
              <Text size={12}>{createdAt.date}</Text>
              <Text size={12}>{createdAt.time}</Text>
            </Cell>
            {/* Peers */}
            <Cell>
              <Text size={12}>{offer.peersCount}</Text>
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
              <Text size={12}>{offer.pricePerEpoch}</Text>
              <TokenBadge bg="grey200">
                <Text size={10} weight={800} color="grey500">
                  {offer.paymentToken.symbol}
                </Text>
              </TokenBadge>
            </Cell>
            {/* Effectors List */}
            <Cell>
              <ShrinkText size={12}>
                {offer.effectors.map((e) => e.description).join(',')}
              </ShrinkText>
              <EffectorsTooltip effectors={offer.effectors} />
            </Cell>
            {/* Details */}
            <Cell>
              <DetailsButton onClick={() => navigate(`/offer/${offer.id}`)}>
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
