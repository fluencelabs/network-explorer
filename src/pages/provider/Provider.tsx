import React from 'react'
import styled from '@emotion/styled'
import { ProviderDetail } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/schemes'

import { A } from '../../components/A'
import { ActiveLink } from '../../components/ActiveLink'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { Copyable } from '../../components/Copyable'
import { Space } from '../../components/Space'
import { Text } from '../../components/Text'
import { formatUnixTimestamp } from '../../utils/formatUnixTimestamp'

import { BLOCKSCOUT_URL } from '../../constants/config'

interface ProviderProps {
  children: React.ReactNode | React.ReactNode[]
  provider: ProviderDetail
}

export const Provider: React.FC<ProviderProps> = ({ children, provider }) => {
  const createdAt = formatUnixTimestamp(provider.createdAt)

  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: 'Providers',
            path: '/',
          },
          {
            label: provider.name,
          },
        ]}
      />
      <Content>
        <Left>
          <Text size={32}>{provider.name}</Text>
          <LeftMenu>
            <ActiveLink href={`/provider/${provider.id}`}>Info</ActiveLink>
            <ActiveLink href={`/provider/${provider.id}/offers`}>
              Offers
            </ActiveLink>
            <ActiveLink href={`/provider/${provider.id}/capacity`}>
              Capacity
            </ActiveLink>
            <ActiveLink href={`/provider/${provider.id}/deals`}>
              Deals
            </ActiveLink>
          </LeftMenu>
        </Left>
        <Right>
          <Space height="32px" />
          <InfoRow>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                Provider ID
              </Text>
              <TextWithIcon>
                <A href={`${BLOCKSCOUT_URL}/address/${provider.id}`}>
                  {provider.id}
                </A>
                <Copyable value={provider.id} />
              </TextWithIcon>
            </Info>
            <Info>
              <Text size={10} weight={700} uppercase color="grey400">
                Registered
              </Text>
              <Text size={12}>
                {createdAt.time} {createdAt.date}
              </Text>
            </Info>
          </InfoRow>
          {children}
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
  display: flex;
`

const LeftMenu = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  font-size: 14px;
  font-weight: 500;
  margin-top: 80px;
`

const InfoRow = styled.div`
  display: grid;
  grid-template-columns: 2fr 1fr;
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
