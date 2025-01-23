import React, { useMemo } from 'react'
import styled from '@emotion/styled'
import { useParams } from 'wouter'

import { A } from '../../components/A'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { Copyable } from '../../components/Copyable'
import { DealStatus } from '../../components/DealStatus'
import { InfoLoader } from '../../components/InfoLoader'
import { NotFound } from '../../components/NotFound'
import { Space } from '../../components/Space'
import { Text } from '../../components/Text'
import { TokenBadge } from '../../components/TokenBadge'
import { useApiQuery } from '../../hooks'
import { formatUSDcTokenValue } from '../../utils'
import { getDatacenterCode } from '../../utils/getDatacenterCode'
import { formatHexData } from '../../utils/helpers'

import { ROUTES } from '../../constants'
import { colors } from '../../constants/colors'
import { BLOCKSCOUT_URL } from '../../constants/config'

import { DealTxTable } from './DealTxTable'
import { ResourceTable } from './ResourceTable'
import { WorkersTable } from './WorkersTable'

export const DealInfo: React.FC = () => {
  const params = useParams()

  const { id } = params

  const { data: deal, isLoading } = useApiQuery((client) =>
    client.getDeal(id ?? ''),
  )

  const providerAddress = useMemo(() => {
    if (!deal || !deal.joinedWorkers || deal.joinedWorkers.length === 0)
      return null
    return deal.joinedWorkers[0].peer.provider
  }, [deal])

  const datacenter = useMemo(() => {
    if (!deal || !deal.joinedWorkers || deal.joinedWorkers.length === 0)
      return null
    return deal.joinedWorkers[0].peer.offer.datacenter
  }, [deal])

  if (isLoading) {
    return <InfoLoader />
  }

  if (!deal || !id) {
    return (
      <NotFound
        message="Not found deal"
        link={ROUTES.deals}
        linkText="Go to deals page"
      />
    )
  }

  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: 'Deals',
            path: '/deals',
          },
          {
            label: id,
          },
        ]}
      />
      <Content>
        <Left>
          <Text size={32}>Deal info</Text>
        </Left>
        <Right>
          <Space height="33px" />
          <InfoRow>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                Deal ID
              </Text>
              <TextWithIcon>
                <Text size={12}>{id}</Text>
                <Copyable value={id} />
              </TextWithIcon>
            </Info>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                Status
              </Text>
              <DealStatus status={deal.status} />
            </Info>
          </InfoRow>
          <Space height="32px" />
          <InfoRow>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                Client
              </Text>
              <TextWithIcon>
                <StyledA
                  href={BLOCKSCOUT_URL + `/address/${deal.client}`}
                  target="_blank"
                >
                  {deal.client}
                </StyledA>
                <Copyable value={deal.client} />
              </TextWithIcon>
            </Info>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                Balance
              </Text>
              <TextWithBadge>
                <Text size={12}>{formatUSDcTokenValue(deal.balance)}</Text>
                <TokenBadge bg="grey200">
                  <Text size={10} weight={800} color="grey500">
                    {deal.paymentToken.symbol}
                  </Text>
                </TokenBadge>
              </TextWithBadge>
            </Info>
          </InfoRow>
          <Space height="32px" />
          <InfoRow>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                App CID
              </Text>
              <TextWithIcon>
                <Text size={12}>{deal.appCID}</Text>
                <Copyable value={deal.appCID} />
              </TextWithIcon>
            </Info>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                Total provider earnings
              </Text>
              <TextWithBadge>
                <Text size={12}>
                  {formatUSDcTokenValue(deal.totalEarnings)}
                </Text>
                <TokenBadge bg="grey200">
                  <Text size={10} weight={800} color="grey500">
                    {deal.paymentToken.symbol}
                  </Text>
                </TokenBadge>
              </TextWithBadge>
            </Info>
          </InfoRow>
          <Space height="56px" />
          {providerAddress && (
            <>
              <Text size={20}>Matching result</Text>
              <Space height="24px" />
              <InfoRow>
                <Info>
                  <Text size={10} weight={700} uppercase color="grey400">
                    Provider
                  </Text>
                  <TextWithIcon>
                    <Text size={12}>{providerAddress}</Text>
                    {providerAddress && <Copyable value={providerAddress} />}
                  </TextWithIcon>
                </Info>
                <Info>
                  <Text size={10} weight={700} uppercase color="grey400">
                    Payment token
                  </Text>
                  <A
                    href={`${BLOCKSCOUT_URL}/address/${deal.paymentToken.address}`}
                  >
                    <Text size={20}>{deal.paymentToken.symbol}</Text>
                  </A>
                </Info>
              </InfoRow>
              <Space height="32px" />
              <InfoRow>
                <Info>
                  <Text size={10} weight={700} uppercase color="grey400">
                    Datacenter
                  </Text>
                  {datacenter ? (
                    <>
                      <TextWithIcon>
                        <Text size={12}>{getDatacenterCode(datacenter)}</Text>
                      </TextWithIcon>
                    </>
                  ) : (
                    <>
                      <TextWithIcon>
                        <Text size={12}>{'-'}</Text>
                      </TextWithIcon>
                    </>
                  )}
                </Info>
                <Info>
                  <Text size={10} weight={700} uppercase color="grey400">
                    Price Per Epoch
                  </Text>
                  <TextWithIcon>
                    <Text size={20}>
                      {formatUSDcTokenValue(deal.pricePerEpoch)}
                    </Text>
                    <TokenBadge bg="grey200">
                      <Text size={10} weight={800} color="grey500">
                        {deal.paymentToken.symbol}
                      </Text>
                    </TokenBadge>
                  </TextWithIcon>
                </Info>
              </InfoRow>
              <Space height="32px" />
              <InfoRow>
                <Info>
                  <Text size={10} weight={700} uppercase color="grey400">
                    Datacenter ID
                  </Text>
                  <TextWithIcon>
                    <Text size={12}>
                      {datacenter ? formatHexData(datacenter?.id) : '-'}
                    </Text>
                    {datacenter && <Copyable value={datacenter?.id} />}
                  </TextWithIcon>
                </Info>
              </InfoRow>
              <Space height="32px" />
              <InfoRow>
                <Info>
                  <Text size={10} weight={700} uppercase color="grey400">
                    Country
                  </Text>
                  <TextWithIcon>
                    <Text size={12}>{datacenter?.countryCode ?? '-'}</Text>
                  </TextWithIcon>
                </Info>
              </InfoRow>
              <Space height="32px" />
              <InfoRow>
                <Info>
                  <Text size={10} weight={700} uppercase color="grey400">
                    City
                  </Text>
                  <TextWithIcon>
                    <Text size={12}>{datacenter?.cityCode ?? '-'}</Text>
                  </TextWithIcon>
                </Info>
              </InfoRow>
            </>
          )}
          <Space height="30px" />
          {!deal.joinedWorkers ||
            (deal.joinedWorkers.length === 0 && (
              <>
                <Space height="40px" />
                <ResourceTable resources={deal.resources} />
              </>
            ))}
          <Space height="40px" />
          <WorkersTable
            dealId={deal.id}
            workers={deal.joinedWorkers}
            resources={deal.resources}
          />
          <Space height="40px" />
          <DealTxTable dealId={id} />
        </Right>
      </Content>
    </>
  )
}

const Content = styled.div`
  display: flex;
  margin-top: 12px;

  @media (max-width: 1100px) {
    flex-direction: column;
  }
`

const Left = styled.div`
  width: 350px;
`

const Right = styled.div`
  width: 100%;
  flex-direction: column;
`

const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 400px 300px;
  gap: 36px;
`

const Info = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const TextWithIcon = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

export const EmptyParameterValue = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 40px;
  width: 100%;
  background: ${colors.grey100};
  border-radius: 8px;
`

const TextWithBadge = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const StyledA = styled.a`
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: ${colors.blue};
`
