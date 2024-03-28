import React from 'react'
import Skeleton from 'react-loading-skeleton'
import styled from '@emotion/styled'
import {
  ChildEntitiesByProviderFilter,
  ProviderChildEntityStatusFilter,
} from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/filters'
import { DealShort } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/schemes'
import { useLocation } from 'wouter'

import { A } from '../../components/A'
import { ButtonGroup } from '../../components/ButtonGroup'
import { DealStatus } from '../../components/DealStatus'
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
import { TokenBadge } from '../../components/TokenBadge'
import { useApiQuery, usePagination } from '../../hooks'
import { useFilters } from '../../hooks/useFilters'
import { formatUnixTimestamp } from '../../utils/formatUnixTimestamp'

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

const PER_PAGE = 5

// type ProviderDealSort = `${DealsOrderBy}:${OrderType}`

const items: {
  value: ProviderChildEntityStatusFilter | 'all'
  label: string
}[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

export const ProviderDealsTable: React.FC<ProviderDealsTableProps> = ({
  providerId,
}) => {
  const [filters, setFilter] = useFilters<ChildEntitiesByProviderFilter>({
    providerId,
  })

  // const [order, setOrder] = useState<ProviderDealSort>('createdAt:desc')
  // const [orderBy, orderType] = order.split(':') as [DealsOrderBy, OrderType]

  const { page, selectPage, limit, offset, getTotalPages } =
    usePagination(PER_PAGE)

  const { data: deals, isLoading } = useApiQuery(
    (client) =>
      client.getDealsByProvider(
        {
          providerId,
          status: filters.status,
        },
        offset,
        limit + 1,
      ),
    [page, filters],
  )

  const hasNextPage = deals && deals.data.length > limit
  const pageDeals = deals && deals.data.slice(0, limit)

  // const handleSort = (key: DealsOrderBy, order: OrderType) => {
  //   setOrder(`${key}:${order}`)
  // }

  const handleSetStatus = (value: ProviderChildEntityStatusFilter) => {
    setFilter('status', value)
  }

  return (
    <>
      <Text size={32}>Deals</Text>
      <Space height="24px" />
      <ButtonGroup
        value={filters.status ?? 'all'}
        onSelect={handleSetStatus}
        items={items}
      />
      <Space height="32px" />
      <ScrollableTable>
        <TableHeader template={template}>
          <TableColumnTitle>Deal Id</TableColumnTitle>
          <TableColumnTitle>Created at</TableColumnTitle>
          {/* TODO -> Matched at */}
          {/* <HeaderCellWithTooltip>
            <TableColumnTitle>Offer Id</TableColumnTitle>
            <Tooltip trigger={<InfoOutlineIcon />}>
              <Text color="grey600" weight={600}>
                The deal was matched from the capacity declared in this offer
              </Text>
            </Tooltip>
          </HeaderCellWithTooltip> */}
          <TableColumnTitle>Payment Token</TableColumnTitle>
          <TableColumnTitle>Matched CU</TableColumnTitle>
          <TableColumnTitle>Active Workers</TableColumnTitle>
          <TableColumnTitle>Status</TableColumnTitle>
        </TableHeader>
        <TableBody isLoading={isLoading} skeletonCount={PER_PAGE}>
          {pageDeals?.map((deal) => <DealRow key={deal.id} deal={deal} />)}
        </TableBody>
      </ScrollableTable>
      <Space height="32px" />
      <TablePagination>
        {!deals ? (
          <Skeleton width={200} height={34} count={1} />
        ) : (
          <Pagination
            pages={getTotalPages(deals.total)}
            page={page}
            hasNextPage={hasNextPage}
            onSelect={selectPage}
          />
        )}
      </TablePagination>
    </>
  )
}

interface DealRowProps {
  deal: DealShort
}

const DealRow: React.FC<DealRowProps> = ({ deal }) => {
  const [, navigate] = useLocation()

  const createdAt = formatUnixTimestamp(deal.createdAt)

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
                <Text size={12}>{createdAt.date}</Text>
                <Text size={12}>{createdAt.time}</Text>
              </Column>
            </Cell>
            {/* <Cell>
              <A href={`/offer/${deal.client}`}>{deal.client}</A>
            </Cell> */}
            <Cell>
              <TokenBadge bg="grey200">
                <Text size={10} weight={800} color="grey500">
                  {deal.paymentToken.symbol}
                </Text>
              </TokenBadge>
            </Cell>
            <Cell>
              <Text size={12}>{deal.matchedWorkers}</Text>
            </Cell>
            <Cell>
              {/* TODO: what active workers are actually means?*/}
              <Text size={12}>{deal.registeredWorkers}</Text>
            </Cell>
            <Cell>
              <DealStatus status={deal.status} />
            </Cell>
            <Cell>
              <DetailsButton
                onClick={() => {
                  navigate(`/deal/${deal.id}`)
                }}
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
