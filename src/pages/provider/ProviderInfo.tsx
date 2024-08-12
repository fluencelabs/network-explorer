import React from 'react'
import styled from '@emotion/styled'
import { useParams } from 'wouter'

import { InfoOutlineIcon } from '../../assets/icons'
import { InfoLoader } from '../../components/InfoLoader'
import { Space } from '../../components/Space'
import { Text } from '../../components/Text'
import { Tooltip } from '../../components/Tooltip'
import { useApiQuery } from '../../hooks'

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

  const { data: provider, isLoading } = useApiQuery((client) =>
    client.getProvider(id ?? ''),
  )

  if (!provider || isLoading) {
    return <InfoLoader />
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
                The total number of peers with activated Capacity Commitments
              </Text>
            </Tooltip>
          </StatisticTitle>
          <Text size={32}>
            {provider.peersTotal - provider.peersInCapacityCommitment}
          </Text>
        </Statistic>
      </StatisticsRow>

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
      {/* <Space height="60px" />
      <Charts>
        <ChartWrapper>
          <ChartLabel>
            <Text size={20}>Capacity revenue</Text>
            <TokenBadge bg="black900">
              <Text size={12} weight={800} color="white">
                FLT
              </Text>
            </TokenBadge>
          </ChartLabel>
          <DataInfoBlock>
            <DataInfoHeader>
              <Text color="grey400" size={10} weight={700}>
                7D
              </Text>
              <Text color="grey400" size={10} weight={700}>
                1M
              </Text>
              <Text color="grey400" size={10} weight={700}>
                3M
              </Text>
              <Text color="grey400" size={10} weight={700}>
                6M
              </Text>
              <Text color="grey400" size={10} weight={700}>
                12M
              </Text>
              <Text color="grey400" size={10} weight={700} uppercase>
                Total
              </Text>
            </DataInfoHeader>
            <DataInfoContent>
              <Text size={12}>10</Text>
              <Text size={12}>60</Text>
              <Text size={12}>230</Text>
              <Text size={12}>450</Text>
              <Text size={12}>1250</Text>
              <Text size={12}>2500</Text>
            </DataInfoContent>
          </DataInfoBlock>
          <AspectRatio.Root ratio={600 / 280}>
            <Chart />
          </AspectRatio.Root>
        </ChartWrapper>
        <ChartWrapper>
          <ChartLabel>
            <Text size={20}>Deal revenue</Text>
            <Select items={items} value={value} onChange={setValue} />
          </ChartLabel>
          <DataInfoBlock>
            <DataInfoHeader>
              <Text color="grey400" size={10} weight={700}>
                7D
              </Text>
              <Text color="grey400" size={10} weight={700}>
                1M
              </Text>
              <Text color="grey400" size={10} weight={700}>
                3M
              </Text>
              <Text color="grey400" size={10} weight={700}>
                6M
              </Text>
              <Text color="grey400" size={10} weight={700}>
                12M
              </Text>
              <Text color="grey400" size={10} weight={700} uppercase>
                Total
              </Text>
            </DataInfoHeader>
            <DataInfoContent>
              <Text size={12}>10</Text>
              <Text size={12}>60</Text>
              <Text size={12}>230</Text>
              <Text size={12}>450</Text>
              <Text size={12}>1250</Text>
              <Text size={12}>2500</Text>
            </DataInfoContent>
          </DataInfoBlock>
          <AspectRatio.Root ratio={600 / 280}>
            <Chart />
          </AspectRatio.Root>
        </ChartWrapper>
      </Charts> */}
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
