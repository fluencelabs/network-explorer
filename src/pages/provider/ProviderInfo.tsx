import React from 'react'
import styled from '@emotion/styled'
import { useParams } from 'wouter'

import { InfoOutlineIcon } from '../../assets/icons'
import { InfoLoader } from '../../components/InfoLoader'
import { NotFound } from '../../components/NotFound'
import { Space } from '../../components/Space'
import { Text } from '../../components/Text'
import { Tooltip } from '../../components/Tooltip'
import { useApiQuery } from '../../hooks'

import { ROUTES } from '../../constants'

import { Provider } from './Provider'

// const items: SelectItem[] = [
//   {
//     label: 'USDC',
//     value: 'USDC',
//   },
// ]

export const ProviderInfo: React.FC = () => {
  // const [value, setValue] = useState(items[0].value)

  const params = useParams()

  const { id } = params

  const { data: provider, isLoading } = useApiQuery(
    ['getProvider', JSON.stringify({ id })],
    (client) => client.getProvider(id ?? ''),
  )

  if (isLoading) {
    return <InfoLoader />
  }

  if (!provider || !id) {
    return (
      <NotFound
        message="Not found provider"
        link={ROUTES.providers}
        linkText="Go to providers page"
      />
    )
  }

  return (
    <Provider provider={provider}>
      <Space height="64px" />
      <StatisticsRow>
        <Statistic>
          <StatisticTitle>
            <Text size={10} weight={700} uppercase color="grey400">
              Confirmed Peers
            </Text>
            <Tooltip trigger={<InfoOutlineIcon />}>
              <Text color="grey600" weight={600} size={12}>
                The total number of peers with activated Capacity Commitments
              </Text>
            </Tooltip>
          </StatisticTitle>
          <Text size={32}>{provider.peersInCapacityCommitment}</Text>
        </Statistic>

        <Statistic>
          <StatisticTitle>
            <Text size={10} weight={700} uppercase color="grey400">
              Unconfirmed Peers
            </Text>
            <Tooltip trigger={<InfoOutlineIcon />}>
              <Text color="grey600" weight={600} size={12}>
                The total number of peers without activated Capacity Commitments
              </Text>
            </Tooltip>
          </StatisticTitle>
          <Text size={32}>
            {provider.peersTotal - provider.peersInCapacityCommitment}
          </Text>
        </Statistic>

        <Statistic>
          <StatisticTitle>
            <Text size={10} weight={700} uppercase color="grey400">
              Total Peers
            </Text>
            <Tooltip trigger={<InfoOutlineIcon />}>
              <Text color="grey600" weight={600} size={12}>
                The total number of peers
              </Text>
            </Tooltip>
          </StatisticTitle>
          <Text size={32}>{provider.peersTotal}</Text>
        </Statistic>
      </StatisticsRow>
      <Space height="64px" />
      <StatisticsRow>
        <Statistic>
          <StatisticTitle>
            <Text size={10} weight={700} uppercase color="grey400">
              Available Compute Units
            </Text>
            <Tooltip trigger={<InfoOutlineIcon />}>
              <Text color="grey600" weight={600} size={12}>
                The total number of Confirmed Compute Units that are not in a
                Deal at the moment
              </Text>
            </Tooltip>
          </StatisticTitle>
          <Text size={32}>{provider.computeUnitsInCapacityCommitment}</Text>
        </Statistic>

        <Statistic>
          <StatisticTitle>
            <Text size={10} weight={700} uppercase color="grey400">
              Confirmed Compute Units
            </Text>
            <Tooltip trigger={<InfoOutlineIcon />}>
              <Text color="grey600" weight={600} size={12}>
                The total number of Compute Units with active Capacity
                Commitment
              </Text>
            </Tooltip>
          </StatisticTitle>
          <Text size={32}>
            {provider.computeUnitsInCapacityCommitment +
              provider.computeUnitsInDeal}
          </Text>
        </Statistic>

        <Statistic>
          <StatisticTitle>
            <Text size={10} weight={700} uppercase color="grey400">
              Total Compute Units
            </Text>
            <Tooltip trigger={<InfoOutlineIcon />}>
              <Text color="grey600" weight={600} size={12}>
                The overall number of Compute Units
              </Text>
            </Tooltip>
          </StatisticTitle>
          <Text size={32}>{provider.computeUnitsTotal}</Text>
        </Statistic>
      </StatisticsRow>
    </Provider>
  )
}

const StatisticsRow = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 1fr;
  gap: 96px 0;
`

const StatisticTitle = styled.div`
  display: flex;
  align-items: center;
`

const Statistic = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-end;
  gap: 32px;
  width: 200px;
`

// const Charts = styled.div`
//   display: flex;
//   flex-direction: column;
//   gap: 45px;
// `

// const ChartWrapper = styled.div`
//   display: flex;
//   flex-direction: column;
//   width: 66%;
// `

// const Chart = styled.div`
//   border-radius: 8px;
//   background-color: ${colors.grey100};
//   width: 100%;
//   height: 100%;
// `

// const ChartLabel = styled.div`
//   display: flex;
//   gap: 16px;
//   align-items: center;
// `

// const DataInfoBlock = styled.div`
//   display: flex;
//   flex-direction: column;
//   margin: 20px 0 6px;
// `

// const DataInfoTable = styled.div`
//   display: grid;
//   grid-template-columns: 1fr 1fr 1fr 1fr 1fr 1fr;
//   padding: 12px;
// `
// const DataInfoHeader = styled(DataInfoTable)``

// const DataInfoContent = styled(DataInfoTable)`
//   border-radius: 8px;
//   background-color: ${colors.grey100};
// `
