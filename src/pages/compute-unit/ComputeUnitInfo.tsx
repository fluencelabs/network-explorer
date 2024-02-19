import React from 'react'
import styled from '@emotion/styled'
import { useParams } from 'wouter'

import { A } from '../../components/A'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { Copyable } from '../../components/Copyable'
import { Space } from '../../components/Space'
import { Status } from '../../components/Status'
import { Text } from '../../components/Text'
import { TokenBadge } from '../../components/TokenBadge'

import { ProofsTable } from './ProofsTable'

export const ComputeUnitInfo: React.FC = () => {
  const params = useParams()

  const { id } = params

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
              <Status color="blue">
                <Text size={10} color="white" uppercase weight={800}>
                  Capacity
                </Text>
              </Status>
            </Info>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                Provider ID
              </Text>
              <TextWithIcon>
                <A href={`/provider/${id}`}>
                  <Text size={12} color="blue">
                    {id}
                  </Text>
                </A>
                <Copyable value={id} />
              </TextWithIcon>
            </Info>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                success proofs / total proofs
              </Text>
              <Text size={12}>278 / 280</Text>
            </Info>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                Commitment ID
              </Text>
              <Text size={12}>
                QmPChd2hVbrJ6bfo3WBcTW4iZnpHm8TEzWkLHmLpXhF68A
              </Text>
            </Info>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                Collateral
              </Text>
              <Row>
                <Text size={12}>9.95</Text>
                <TokenBadge bg="black900">
                  <Text size={10} weight={800} color="white">
                    FLT
                  </Text>
                </TokenBadge>
              </Row>
            </Info>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                Peer ID
              </Text>
              <Text size={12}>
                12D3KooWAKNos2KogexTXhrkMZzFYpLHuWJ4PgoAhurSAv7o5CWA
              </Text>
            </Info>
          </InfoRow>
          <Space height="60px" />
          <Text size={20}>Proofs</Text>
          <Space height="32px" />
          <ProofsTable />
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
