import React from 'react'
import styled from '@emotion/styled'
import { useParams } from 'wouter'

import { A } from '../../components/A'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { Copyable } from '../../components/Copyable'
import { InfoLoader } from '../../components/InfoLoader'
import { NotFound } from '../../components/NotFound'
import { Space } from '../../components/Space'
import { Text } from '../../components/Text'
import { useApiQuery } from '../../hooks'

import { ROUTES } from '../../constants'

import { PeerCapacityCommitmentsTable } from './PeerCapacityCommitmentsTable'
import { PeerDealsTable } from './PeerDealsTable'

export const PeerInfo: React.FC = () => {
  const params = useParams()

  const { id } = params

  const { data: peer, isLoading } = useApiQuery((client) =>
    client.getPeer(id ?? ''),
  )

  if (!peer || isLoading) {
    return <InfoLoader />
  }

  if (!peer || !id) {
    return (
      <NotFound
        message="Not found peer"
        link={ROUTES.providers}
        linkText="Go to providers page"
      />
    )
  }

  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: 'Peers',
            path: '/peers',
          },
          {
            label: id ?? '',
          },
        ]}
      />
      <Content>
        <Left>
          <Text size={32}>Peer info</Text>
        </Left>
        <Right>
          <Space height="33px" />
          <InfoRow>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                Peer ID
              </Text>
              <TextWithIcon>
                <Text size={12}>{id}</Text>
                <Copyable value={id ?? ''} />
              </TextWithIcon>
            </Info>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                CU in deals
              </Text>
              <Text size={12}>{peer.computeUnitsInDeal}</Text>
            </Info>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                Provider ID
              </Text>
              <TextWithIcon>
                <A href={`/provider/${peer.providerId}`}>{peer.providerId}</A>
                <Copyable value={peer.providerId} />
              </TextWithIcon>
            </Info>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                CU in capacity commitment
              </Text>
              <Text size={12}>{peer.computeUnitsInCapacityCommitment}</Text>
            </Info>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                Offer ID
              </Text>
              <TextWithIcon>
                <A href={`/offer/${peer.offerId}`}>{peer.offerId}</A>
                <Copyable value={peer.offerId} />
              </TextWithIcon>
            </Info>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                Total CU
              </Text>
              <Text size={12}>{peer.computeUnitsTotal}</Text>
            </Info>
          </InfoRow>
          <Space height="80px" />
          <PeerCapacityCommitmentsTable peerId={peer.id} />
          <PeerDealsTable peerId={peer.id} />
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
