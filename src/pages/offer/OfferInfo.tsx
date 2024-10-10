import React from 'react'
import styled from '@emotion/styled'
import { Link, useParams } from 'wouter'

import { A } from '../../components/A'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { Copyable } from '../../components/Copyable'
import { InfoLoader } from '../../components/InfoLoader'
import { NotFound } from '../../components/NotFound'
import { Space } from '../../components/Space'
import { Text } from '../../components/Text'
import { TokenBadge } from '../../components/TokenBadge'
import { useApiQuery } from '../../hooks'
import { formatUnixTimestamp } from '../../utils/formatUnixTimestamp'

import { ROUTES } from '../../constants'

import { PeersTable } from './PeersTable'
import { SupportedEffectorsTable } from './SupportedEffectorsTable'

export const OfferInfo: React.FC = () => {
  const params = useParams()

  const { id } = params

  const { data: offer, isLoading } = useApiQuery((client) =>
    client.getOffer(id ?? ''),
  )

  if (isLoading) {
    return <InfoLoader />
  }

  if (!offer || !id) {
    return (
      <NotFound
        message="Not found offer"
        link={ROUTES.offers}
        linkText="Go to offers page"
      />
    )
  }

  const createdAt = formatUnixTimestamp(offer.createdAt)
  const updatedAt = formatUnixTimestamp(offer.updatedAt)

  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: 'Offers',
            path: '/offers',
          },
          {
            label: id,
          },
        ]}
      />
      <Content>
        <Left>
          <Text size={32}>Offer info</Text>
        </Left>
        <Right>
          <Space height="33px" />
          <InfoRow>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                Offer ID
              </Text>
              <TextWithIcon>
                <A href={`/offer/${id}`}>{offer!.id}</A>
                <Copyable value={id} />
              </TextWithIcon>
            </Info>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                Created
              </Text>
              <Text size={12}>
                {createdAt.time} {createdAt.date}
              </Text>
            </Info>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                Provider ID
              </Text>
              <TextWithIcon>
                <Text size={12}>
                  <Link href={`/provider/${offer.providerId}`}>
                    {offer.providerId}
                  </Link>
                </Text>
                <Copyable value={offer.providerId} />
              </TextWithIcon>
            </Info>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                Updated
              </Text>
              <Text size={12}>
                {updatedAt.time} {updatedAt.date}
              </Text>
            </Info>
          </InfoRow>
          <Space height="56px" />
          <Text size={20}>Offer parameters</Text>
          <Space height="30px" />
          <ParametersRow>
            <Parameter>
              <Text size={10} weight={700} uppercase color="grey400">
                Price per worker epoch
              </Text>
              <ParameterValue>
                <Text size={20}>{offer.pricePerEpoch}</Text>
                <TokenBadge bg="grey300">
                  <Text size={12} weight={800} color="grey600">
                    {offer.paymentToken.symbol}
                  </Text>
                </TokenBadge>
              </ParameterValue>
            </Parameter>
          </ParametersRow>
          <Space height="60px" />
          <Text size={20}>Supported effectors</Text>
          <Space height="24px" />
          <PeersTableWrapper>
            <SupportedEffectorsTable effectors={offer.effectors} />
          </PeersTableWrapper>
          <Space height="40px" />
          <Text size={20}>Peers</Text>
          <Space height="24px" />
          <PeersTableWrapper>
            <PeersTable peers={offer.peers} />
          </PeersTableWrapper>
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
  grid-template-columns: fit-content(400px) fit-content(400px);
  gap: 32px 100px;
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

const ParametersRow = styled.div`
  display: flex;
  flex-direction: row;
  gap: 200px;
`

const Parameter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`

const ParameterValue = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const PeersTableWrapper = styled.div`
  width: 70%;
`
