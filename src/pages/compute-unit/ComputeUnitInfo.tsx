import React from 'react'
import styled from '@emotion/styled'
import { useParams } from 'wouter'

import { A } from '../../components/A'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { ComputeUnitStatus } from '../../components/ComputeUnitStatus'
import { Copyable } from '../../components/Copyable'
import { InfoLoader } from '../../components/InfoLoader'
import { NotFound } from '../../components/NotFound'
import { Space } from '../../components/Space'
import { Text } from '../../components/Text'
import TokenBalance from '../../components/TokenBalance'
import { useApiQuery } from '../../hooks'

import { ROUTES } from '../../constants'

export const ComputeUnitInfo: React.FC = () => {
  const params = useParams()

  const { id } = params

  const {
    data: computeUnit,
    isLoading,
    isFetchedAfterMount,
  } = useApiQuery(['getComputeUnit', JSON.stringify({ id })], (client) =>
    client.getComputeUnit(id ?? ''),
  )

  if (isLoading || !isFetchedAfterMount) {
    return <InfoLoader />
  }

  if (!computeUnit || !id) {
    return (
      <NotFound
        message="Not found compute unit"
        link={ROUTES.capacities}
        linkText="Go to providers page"
      />
    )
  }

  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: 'Compute units',
            path: '/compute-unit',
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
                <TokenBalance
                  balance={computeUnit.collateral}
                  symbol={computeUnit.collateralToken.symbol}
                  decimals={Number(computeUnit.collateralToken.decimals)}
                />
              </Row>
            </Info>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                Peer ID
              </Text>
              <Text size={12}>{computeUnit.peerId}</Text>
            </Info>
          </InfoRow>
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
