import React, { ReactNode } from 'react'
import styled from '@emotion/styled'
import { useParams } from 'wouter'

import { InfoOutlineIcon } from '../../assets/icons'
import { A } from '../../components/A'
import { Breadcrumbs } from '../../components/Breadcrumbs'
import { CapacityStatus } from '../../components/CapacityStatus'
import { Copyable } from '../../components/Copyable'
import Hint from '../../components/Hint'
import { InfoLoader } from '../../components/InfoLoader'
import { NotFound } from '../../components/NotFound'
import { Space } from '../../components/Space'
import { Text } from '../../components/Text'
import { TokenBadge } from '../../components/TokenBadge'
import TokenBalance from '../../components/TokenBalance'
import { Tooltip } from '../../components/Tooltip'
import { useApiQuery } from '../../hooks'
import { formatNativeTokenValue } from '../../utils'
import { formatUnixTimestamp } from '../../utils/formatUnixTimestamp'

import { ROUTES } from '../../constants'
import { BLOCKSCOUT_URL } from '../../constants/config'

import { ListComputeUnitsTable } from './ListComputeUnitsTable'

const Record: React.FC<{
  title: ReactNode
  hint?: ReactNode
  balance: bigint
  symbol?: string
}> = ({ title, hint, balance, symbol }) => {
  return (
    <Parameter>
      <Row>
        <Text size={10} weight={700} uppercase color="grey400">
          {title}
        </Text>
        {hint && <Hint>{hint}</Hint>}
      </Row>
      <ParameterValue>
        <TokenBalance balance={balance} symbol={symbol} />
      </ParameterValue>
    </Parameter>
  )
}

const Rewards: React.FC<{
  title: string
  symbol?: string
  inVesting: bigint
  availableToClaim: bigint
  claimed: bigint
}> = ({ title, symbol, inVesting, availableToClaim, claimed }) => {
  return (
    <div>
      <Text size={24}>{title}</Text>
      <Space height="24px" />
      <Record title="In vesting" balance={inVesting} symbol={symbol} />
      <Space height="32px" />
      <Record
        title="Available to claim"
        balance={availableToClaim}
        symbol={symbol}
      />
      <Space height="32px" />
      <Record title="Total claimed" balance={claimed} symbol={symbol} />
    </div>
  )
}

export const CapacityInfo: React.FC = () => {
  const params = useParams()

  const { id } = params

  const { data: capacity, isLoading } = useApiQuery((client) =>
    client.getCapacityCommitment(id ?? ''),
  )

  if (isLoading) {
    return <InfoLoader />
  }

  if (!capacity || !id) {
    return (
      <NotFound
        message="Not found capacity"
        link={ROUTES.capacities}
        linkText="Go to capacities page"
      />
    )
  }

  const createdAt = formatUnixTimestamp(capacity.createdAt)
  const expiredAt = capacity.expiredAt
    ? formatUnixTimestamp(capacity.expiredAt)
    : { date: '-', time: '' }

  return (
    <>
      <Breadcrumbs
        items={[
          {
            label: 'Capacity',
            path: '/capacities',
          },
          {
            label: id,
          },
        ]}
      />
      <Content>
        <Left>
          <Text size={32}>Capacity commitment</Text>
        </Left>
        <Right>
          <Space height="33px" />
          <InfoRow>
            <Info>
              <Row>
                <Text size={10} weight={700} uppercase color="grey400">
                  Capacity commitment
                </Text>
                <Tooltip trigger={<InfoOutlineIcon />}>
                  <Text color="grey600" weight={600} size={12}>
                    Unique identifier of the Capacity commitment.
                  </Text>
                </Tooltip>
              </Row>
              <TextWithIcon>
                <A href={`/capacity/${id}`}>{id}</A>
                <Copyable value={id} />
              </TextWithIcon>
            </Info>
            <Info>
              <Row>
                <Text size={10} weight={700} uppercase color="grey400">
                  Compute units
                </Text>
                <Tooltip trigger={<InfoOutlineIcon />}>
                  <Text color="grey600" weight={600} size={12}>
                    Number of Compute Units of the Peer linked to the Capacity
                    <br />
                    commitment.
                  </Text>
                </Tooltip>
              </Row>
              <Text size={12}>{capacity.computeUnitsCount}</Text>
            </Info>
            <Info>
              <Row>
                <Text size={10} weight={700} uppercase color="grey400">
                  Created at
                </Text>
                <Tooltip trigger={<InfoOutlineIcon />}>
                  <Text color="grey600" weight={600} size={12}>
                    Time when the Capacity commitment was created.
                  </Text>
                </Tooltip>
              </Row>
              <Text size={12}>
                {createdAt.date} {createdAt.time}
              </Text>
            </Info>
            <Info>
              <Row>
                <Text size={10} weight={700} uppercase color="grey400">
                  Provider id
                </Text>
                <Tooltip trigger={<InfoOutlineIcon />}>
                  <Text color="grey600" weight={600} size={12}>
                    Identifier of the Provider who submitted the Capacity
                    <br />
                    commitment for the Peer.
                  </Text>
                </Tooltip>
              </Row>
              <A href={`/provider/${capacity.providerId}`}>
                {capacity.providerId}
              </A>
            </Info>
            <Info>
              <Row>
                <Text size={10} weight={700} uppercase color="grey400">
                  Total collateral
                </Text>
                <Tooltip trigger={<InfoOutlineIcon />}>
                  <Text color="grey600" weight={600} size={12}>
                    Collateral required to activate the Capacity Commitment.
                  </Text>
                </Tooltip>
              </Row>
              <Row>
                <Text size={12}>
                  {formatNativeTokenValue(capacity.totalCollateral)}
                </Text>
                <TokenBadge bg="black900">
                  <Text size={10} weight={800} color="white">
                    {capacity.collateralToken.symbol}
                  </Text>
                </TokenBadge>
              </Row>
            </Info>
            <Info>
              <Row>
                <Text size={10} weight={700} uppercase color="grey400">
                  Expiration
                </Text>
                <Tooltip trigger={<InfoOutlineIcon />}>
                  <Text color="grey600" weight={600} size={12}>
                    Time when the Capacity commitment expires.
                  </Text>
                </Tooltip>
              </Row>
              <Text size={12}>
                {expiredAt.date} {expiredAt.time}
              </Text>
            </Info>
            <Info>
              <Row>
                <Text size={10} weight={700} uppercase color="grey400">
                  Peer id
                </Text>
                <Tooltip trigger={<InfoOutlineIcon />}>
                  <Text color="grey600" weight={600} size={12}>
                    Unique identifier of the Fluence Peer associated with the
                    <br />
                    Capacity commitment.
                  </Text>
                </Tooltip>
              </Row>
              <TextWithIcon>
                <A href={`/peer/${capacity.peerId}`}>{capacity.peerId}</A>
                <Copyable value={capacity.peerId} />
              </TextWithIcon>
            </Info>
            <Info>
              <Row>
                <Text size={10} weight={700} uppercase color="grey400">
                  Staking reward
                </Text>
                <Tooltip trigger={<InfoOutlineIcon />}>
                  <Text color="grey600" weight={600} size={12}>
                    Share of rewards that will be allocated to the Staker who
                    <br />
                    activated the Capacity commitment.
                  </Text>
                </Tooltip>
              </Row>
              <Text size={12}>{capacity.rewardDelegatorRate.toFixed(2)}%</Text>
            </Info>
            <Info>
              <Row>
                <Text size={10} weight={700} uppercase color="grey400">
                  Status
                </Text>
                <Tooltip trigger={<InfoOutlineIcon />}>
                  <Text color="grey600" weight={600} size={12}>
                    Current status of the Capacity commitment.
                  </Text>
                </Tooltip>
              </Row>
              <CapacityStatus status={capacity.status} />
            </Info>
            <Info>
              <Row>
                <Text size={10} weight={700} uppercase color="grey400">
                  Staker address
                </Text>
                <Tooltip trigger={<InfoOutlineIcon />}>
                  <Text color="grey600" weight={600} size={12}>
                    Staker Address who can activate the Capacity commitment.
                  </Text>
                </Tooltip>
              </Row>
              <TextWithIcon>
                <A href={`${BLOCKSCOUT_URL}/address/${capacity.stakerAddress}`}>
                  {capacity.stakerAddress}
                </A>
                <Copyable value={capacity.stakerAddress ?? ''} />
              </TextWithIcon>
            </Info>
          </InfoRow>
          <Space height="64px" />
          <Text size={24}>Rewards</Text>
          <Space height="24px" />
          <ParametersRow>
            <Parameter>
              <Row>
                <Text size={10} weight={700} uppercase color="grey400">
                  Total CC rewards over time
                </Text>
                <Tooltip trigger={<InfoOutlineIcon />}>
                  <Text color="grey600" weight={600} size={12}>
                    The total amount of rewards in FLT tokens earned by the
                    <br />
                    capacity commitment since activation.
                  </Text>
                </Tooltip>
              </Row>
              <ParameterValue>
                <TokenBalance
                  balance={capacity.rewards.total}
                  symbol={capacity.collateralToken.symbol}
                />
              </ParameterValue>
            </Parameter>
          </ParametersRow>
          <Space height="40px" />
          <ParametersRow>
            <Rewards
              title="Provider"
              symbol={capacity.collateralToken.symbol}
              inVesting={capacity.rewards.provider.inVesting}
              availableToClaim={capacity.rewards.provider.availableToClaim}
              claimed={capacity.rewards.provider.claimed}
            />
            <Rewards
              title="Staker"
              symbol={capacity.collateralToken.symbol}
              inVesting={capacity.rewards.staker.inVesting}
              availableToClaim={capacity.rewards.staker.availableToClaim}
              claimed={capacity.rewards.staker.claimed}
            />
          </ParametersRow>
          <Space height="80px" />
          <ListComputeUnitsTable capacityCommitmentId={id} />
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
  display: flex;
  width: 100%;
  flex-direction: column;
`

const InfoRow = styled.div`
  display: grid;
  grid-template-columns:
    fit-content(400px) fit-content(400px)
    fit-content(400px);
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
  display: grid;
  grid-template-columns: 200px 200px;
  gap: 120px;
`

const Parameter = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`

const ParameterValue = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`

const Row = styled.div`
  display: flex;
  align-items: center;
  gap: 4px;
`
