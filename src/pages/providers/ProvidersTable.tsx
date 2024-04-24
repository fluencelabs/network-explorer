import React, { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { keyframes } from '@emotion/react'
import styled from '@emotion/styled'
import {
  OrderType,
  ProvidersFilters,
  ProviderShortOrderBy,
} from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/filters'
import {
  OfferShort,
  ProviderShort,
} from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/schemes'
import * as Accordion from '@radix-ui/react-accordion'
import { useLocation } from 'wouter'

import { ApprovedIcon, ArrowIcon, InfoOutlineIcon } from '../../assets/icons'
import ProviderYellow from '../../assets/providers/yellow.png'
import { A } from '../../components/A'
import { EffectorsTooltip } from '../../components/EffectorsTooltip'
import { Pagination } from '../../components/Pagination'
import { Space } from '../../components/Space'
import {
  Cell,
  HeaderCellWithTooltip,
  Row,
  RowBlock,
  ScrollableTable,
  TableBody,
  TableColumnTitle,
  TableColumnTitleWithSort,
  TableHeader,
  TablePagination,
} from '../../components/Table'
import { ShrinkText, Text } from '../../components/Text'
import { TokenBadge } from '../../components/TokenBadge'
import { Tooltip } from '../../components/Tooltip'
import { usePagination } from '../../hooks'
import { useApiQuery } from '../../hooks/useApiQuery'

import { colors } from '../../constants/colors'

const template = [
  'minmax(150px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(100px, 1fr)',
  'minmax(50px, 1fr)',
  '60px',
]

interface ProviderRowProps {
  provider: ProviderShort
  toggle: (id: string) => void
}

type ProviderSort = `${ProviderShortOrderBy}:${OrderType}`

interface ProviderTableProps {
  filters: ProvidersFilters
}

interface ProviderAddressProps {
  id: string
  className?: string
}

const ProviderAddress: React.FC<ProviderAddressProps> = ({ id, ...rest }) => {
  return (
    <A href={`/offer/${id}`} {...rest}>
      {id}
    </A>
  )
}

const PROVIDERS_PER_PAGE = 15

export const ProviderTable: React.FC<ProviderTableProps> = ({ filters }) => {
  const [order, setOrder] = useState<ProviderSort>('createdAt:desc')
  const [orderBy, orderType] = order.split(':') as [
    ProviderShortOrderBy,
    OrderType,
  ]

  const { page, selectPage, limit, offset, getTotalPages } =
    usePagination(PROVIDERS_PER_PAGE)

  const [isAccordionOpen, setIsAccordionOpen] = useState<string[]>([])

  const { data: providers, isLoading } = useApiQuery(
    (client) =>
      client.getProviders(filters, offset, limit + 1, orderBy, orderType),
    [page, orderBy, orderType, filters],
    {
      key: `providers:${JSON.stringify({
        filters,
        offset,
        limit,
        order,
        orderBy,
      })}`,
      ttl: 1_000 * 60, // 1 minute
    },
  )

  const hasNextPage = providers && providers.data.length > limit
  const pageProviders = providers && providers.data.slice(0, limit)

  const toggle = (id: string) => {
    if (isAccordionOpen.includes(id)) {
      return setIsAccordionOpen((arr) => arr.filter((v) => v !== id))
    }

    setIsAccordionOpen([...isAccordionOpen, id])
  }

  const handleSort = (key: ProviderShortOrderBy, order: OrderType) => {
    setOrder(`${key}:${order}`)
  }

  return (
    <>
      <ScrollableTable>
        <TableHeader template={template}>
          <TableColumnTitle>Name</TableColumnTitle>
          <TableColumnTitle>Provider Address</TableColumnTitle>
          <TableColumnTitle>Peers</TableColumnTitle>
          <TableColumnTitleWithSort
            order={orderType}
            field="computeUnitsTotal"
            isActive={orderBy === 'computeUnitsTotal'}
            onSort={handleSort}
          >
            Compute Units{' '}
            <Text size={10} weight={500} color="green" uppercase>
              ( Available )
            </Text>
          </TableColumnTitleWithSort>
          <HeaderCellWithTooltip>
            <TableColumnTitle>Approved</TableColumnTitle>
            <Tooltip trigger={<InfoOutlineIcon />}>
              <Text color="grey600" weight={600}>
                DAO Approved Providers
              </Text>
            </Tooltip>
          </HeaderCellWithTooltip>
        </TableHeader>
        <Accordion.Root type="multiple" value={isAccordionOpen}>
          <TableBody
            skeletonCount={PROVIDERS_PER_PAGE}
            skeletonHeight={40}
            isLoading={isLoading}
          >
            {pageProviders?.map((provider) => (
              <ProviderRow
                key={provider.id}
                provider={provider}
                toggle={toggle}
              />
            ))}
          </TableBody>
        </Accordion.Root>
      </ScrollableTable>
      <Space height="32px" />
      <TablePagination>
        {!providers ? (
          <Skeleton width={200} height={34} count={1} />
        ) : (
          <Pagination
            pages={getTotalPages(providers.total)}
            page={page}
            hasNextPage={hasNextPage}
            onSelect={selectPage}
          />
        )}
      </TablePagination>
    </>
  )
}

const ProviderRow: React.FC<ProviderRowProps> = ({ toggle, provider }) => {
  const [, navigate] = useLocation()

  const handleOpen = (e: React.MouseEvent) => {
    e.stopPropagation()
    toggle(provider.id)
  }
  return (
    <Accordion.Item value={provider.id}>
      <RowBlock>
        <RowHeader asChild onClick={() => navigate(`/provider/${provider.id}`)}>
          <Row template={template}>
            <Cell>
              <ImgStyled src={ProviderYellow} />
              <Space width="8px" />
              <Text size={14}>{provider.name}</Text>
            </Cell>
            <Cell>
              <A href={`/provider/${provider.id}`}>{provider.id}</A>
            </Cell>
            <Cell>
              <Text size={12}>{provider.peerCount}</Text>
            </Cell>
            <Cell>
              <Text size={12}>{provider.totalComputeUnits}</Text>
              <Space width="6px" />
              <ProviderComputeUnitsAvailable size={12} color="white">
                {provider.freeComputeUnits}
              </ProviderComputeUnitsAvailable>
            </Cell>
            <Cell>{provider.isApproved ? <ApprovedIcon /> : <>-</>}</Cell>
            <Cell onClick={handleOpen}>
              {/* <ProviderTrigger> */}
              <Text size={10} weight={800} uppercase>
                Offers
              </Text>
              <ArrowIconStyled />
              {/* </ProviderTrigger> */}
            </Cell>
          </Row>
        </RowHeader>
        <AccordionContent>
          <ProviderRowContent offers={provider.offers} />
        </AccordionContent>
      </RowBlock>
    </Accordion.Item>
  )
}

interface ProviderRowContentProps {
  offers: OfferShort[]
}

const ProviderRowContent: React.FC<ProviderRowContentProps> = ({ offers }) => {
  const [, navigate] = useLocation()

  return (
    <ProviderContentBlock>
      <Border />
      <ProviderContentHeader>
        <TableColumnTitle>#</TableColumnTitle>
        <TableColumnTitle>Offer ID</TableColumnTitle>
        <TableColumnTitle>Peers</TableColumnTitle>
        <TableColumnTitle>Compute Units</TableColumnTitle>
        <TableColumnTitle>Payment Token</TableColumnTitle>
        <TableColumnTitle>Effectors</TableColumnTitle>
      </ProviderContentHeader>
      <ProviderContentTable>
        {offers.map((offer, index) => (
          <ProviderContentRow key={offer.id}>
            {/* # */}
            <Cell>
              <Text size={12}>{index + 1}</Text>
            </Cell>
            {/* Offer ID */}
            <Cell>
              <PaddedProviderAddress id={offer.id}></PaddedProviderAddress>
            </Cell>

            {/* Peers */}
            <Cell>
              <Text size={12}>{offer.peersCount}</Text>
            </Cell>
            <Cell>
              <Text size={12}>{offer.totalComputeUnits}</Text>
              <Space width="6px" />
              <ProviderComputeUnitsAvailable size={12} color="white">
                {offer.freeComputeUnits}
              </ProviderComputeUnitsAvailable>
            </Cell>
            {/* Compute Units */}
            <Cell>
              <TokenBadge>
                <Text size={10} color="grey500" weight={800}>
                  {offer.paymentToken.symbol}
                </Text>
              </TokenBadge>
            </Cell>
            {/* Payment Token */}
            <Cell>
              <ShrinkText size={12}>
                {offer.effectors.map((e) => e.description).join(',')}
              </ShrinkText>
              <EffectorsTooltip effectors={offer.effectors} />
            </Cell>
            {/* Effectors */}
            <Cell>
              <DetailsButton onClick={() => navigate(`/offer/${offer.id}`)}>
                <Text size={10} weight={800} uppercase>
                  Details
                </Text>
              </DetailsButton>
            </Cell>
          </ProviderContentRow>
        ))}
      </ProviderContentTable>
    </ProviderContentBlock>
  )
}

const ArrowIconStyled = styled(ArrowIcon)`
  transition: transform 200ms;
`

const RowHeader = styled(Accordion.Header)`
  width: 100%;
  cursor: pointer;
  padding: 8px 12px;

  &[data-state='open'] {
    ${ArrowIconStyled} {
      transform: rotate(-90deg);
    }
  }
`

const ProviderComputeUnitsAvailable = styled(Text)`
  background-color: ${colors.green};
  padding: 1px 6px;
  border-radius: 100px;
`

const Border = styled.div`
  height: 1px;
  background-color: ${colors.grey500};
  margin-bottom: 16px;
  opacity: 0.2;
`

const ProviderContentBlock = styled.div`
  display: flex;
  flex-direction: column;
  padding: 8px 12px;
`

const GridBaseProviderContent = styled.div`
  display: grid;
  grid-template-columns:
    25px minmax(150px, 1fr) 150px
    minmax(10px, 1fr) minmax(100px, 1fr) minmax(50px, 1fr) 75px;
`

const ProviderContentRow = styled(GridBaseProviderContent)`
  background-color: ${colors.white};
  border-radius: 8px;
  padding: 6px 6px 6px 12px;
  height: 40px;
`

const ProviderContentHeader = styled(GridBaseProviderContent)`
  padding: 0px 6px 12px 12px;
`

const DetailsButton = styled.div`
  display: flex;
  align-items: center;
  background-color: ${colors.grey100};
  padding: 5px 12px;
  border-radius: 4px;
  cursor: pointer;
`

const ProviderContentTable = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const slideDown = keyframes`
  from {
    height: 0;
  }
  to {
    height: var(--radix-accordion-content-height);
  }
`

const slideUp = keyframes`
  from {
    height: var(--radix-accordion-content-height);
  }
  to {
    height: 0;
  }
`

const AccordionContent = styled(Accordion.Content)`
  overflow: hidden;

  &[data-state='open'] {
    animation: ${slideDown} 300ms;
  }
  &[data-state='closed'] {
    animation: ${slideUp} 300ms;
  }
`

const ImgStyled = styled.img`
  height: 24px;
  width: 24px;
`

const PaddedProviderAddress = styled(ProviderAddress)`
  padding-right: 30px;
`
