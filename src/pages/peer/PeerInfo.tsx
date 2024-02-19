import React, { useState } from 'react'
import styled from '@emotion/styled'
import { useParams } from 'wouter'

import { A } from '../../components/A'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { ButtonGroup } from '../../components/ButtonGroup'
import { Copyable } from '../../components/Copyable'
import { Space } from '../../components/Space'
import { Text } from '../../components/Text'

import { CapacityCommitmentsTable } from './CapacityCommitmentsTable'
import { DealsTable } from './DealsTable'

const items = [
  { value: 'all', label: 'All' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' },
]

export const PeerInfo: React.FC = () => {
  const params = useParams()
  const [value, setValue] = useState(items[0].value)

  const { id } = params

  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: 'Peers',
            path: '/proofs',
          },
          {
            label: id,
          },
        ]}
      />
      <Content>
        <Left>
          <Text size={32}>Peer ID</Text>
        </Left>
        <Right>
          <Space height="33px" />
          <InfoRow>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                Provider ID
              </Text>
              <TextWithIcon>
                <A href={`/provider/${id}`}>{id}</A>
                <Copyable value={id} />
              </TextWithIcon>
            </Info>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                CU in deals
              </Text>
              <Text size={12}>33</Text>
            </Info>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                Peer ID
              </Text>
              <Text size={12}>{id}</Text>
            </Info>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                CU in capacity commitment
              </Text>
              <Text size={12}>87</Text>
            </Info>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                Offer ID
              </Text>
              <Text size={12}>{id}</Text>
            </Info>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                Total CU
              </Text>
              <Text size={12}>87</Text>
            </Info>
          </InfoRow>
          <Space height="80px" />
          <Text size={20}>Capacity commitments</Text>
          <Space height="24px" />
          <ButtonGroup value={value} onSelect={setValue} items={items} />
          <Space height="34px" />
          <CapacityCommitmentsTable />
          <Space height="40px" />
          <Text size={20}>Deals</Text>
          <Space height="32px" />
          <DealsTable />
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
