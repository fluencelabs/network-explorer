import React from 'react'
import styled from '@emotion/styled'
import { useParams } from 'wouter'

import { A } from '../../components/A'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { ComputeUnitStatus } from '../../components/ComputeUnitStatus'
import { Copyable } from '../../components/Copyable'
import { InfoLoader } from '../../components/InfoLoader'
import { Space } from '../../components/Space'
import { Text } from '../../components/Text'
import { TokenBadge } from '../../components/TokenBadge'
import { useApiQuery } from '../../hooks'

import { ComputeUnitProofsTable } from './ComputeUnitProofsTable'

export const ComputeUnitInfo: React.FC = () => {
  const params = useParams()

  const { id } = params

  const { data: computeUnit, isLoading } = useApiQuery((client) =>
    client.getComputeUnit(id),
  )

  if (!computeUnit || isLoading) {
    return <InfoLoader />
  }

  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: 'Compute units',
            path: '/proofs',
          },
          {
            label: id,
          },
        ]}
      />
      <Content>
        <Left>
          <Text size={32}>Compute unit info</Text>
        </Left>
        <Right>
          <Space height="33px" />
          <InfoRow>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                Compute unit ID
              </Text>
              <Text size={12}>{id}</Text>
            </Info>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                Status
              </Text>
              <ComputeUnitStatus status={computeUnit.status} />
            </Info>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                Provider ID
              </Text>
              <TextWithIcon>
                <A href={`/provider/${computeUnit.providerId}`}>
                  <Text size={12} color="blue">
                    {computeUnit.providerId}
                  </Text>
                </A>
                <Copyable value={computeUnit.providerId} />
              </TextWithIcon>
            </Info>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                success proofs
              </Text>
              <Text size={12}>{computeUnit.successProofs}</Text>
            </Info>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                Commitment ID
              </Text>
              <Text size={12}>{computeUnit.currentCommitmentId}</Text>
            </Info>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                Collateral
              </Text>
              <Row>
                <Text size={12}>{computeUnit.collateral}</Text>
                <TokenBadge bg="black900">
                  <Text size={10} weight={800} color="white">
                    {computeUnit.collateralToken.symbol}
                  </Text>
                </TokenBadge>
              </Row>
            </Info>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                Peer ID
              </Text>
              <Text size={12}>{computeUnit.peerId}</Text>
            </Info>
          </InfoRow>
          <Space height="60px" />
          <ComputeUnitProofsTable computeUnitId={id} />
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

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`
