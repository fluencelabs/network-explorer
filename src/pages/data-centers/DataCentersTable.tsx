import React from 'react'
import Skeleton from 'react-loading-skeleton'
import { Datacenter } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/indexerClient/generated.types'

import { A } from '../../components/A'
import { Pagination } from '../../components/Pagination'
import { Space } from '../../components/Space'
import {
  Cell,
  Row,
  RowBlock,
  RowHeader,
  RowTrigger,
  ScrollableTable,
  TableBody,
  TableColumnTitle,
  TableHeader,
  TablePagination,
} from '../../components/Table'
import { Text } from '../../components/Text'
import { useApiQuery, usePagination } from '../../hooks'
import { getDatacenterCode } from '../../utils/getDatacenterCode'
import { formatHexData } from '../../utils/helpers'

const template = [
  'minmax(50px, 1fr)',
  'minmax(50px, 1fr)',
  'minmax(50px, 1fr)',
  'minmax(50px, 1fr)',
  'minmax(50px, 1fr)',
  'minmax(400px, 1fr)',
  'minmax(50px, 1fr)',
  'minmax(50px, 1fr)',
]

export const DATA_CENTERS_PER_PAGE = 5

interface DataCentersTableProps {
  pagination: ReturnType<typeof usePagination>
}

export const DataCentersTable: React.FC<DataCentersTableProps> = ({
  pagination,
}) => {
  const { page, selectPage, limit, getTotalPages } = pagination

  const { data: dataCenters, isLoading } = useApiQuery(
    ['dataCenters'],
    (client) => client.getDataCenters(),
  )

  const hasNextPage = dataCenters && dataCenters.data.length > limit
  const pageDataCenters =
    dataCenters &&
    dataCenters.data.slice((page - 1) * limit, (page - 1) * limit + limit)

  return (
    <>
      <ScrollableTable>
        <TableHeader template={template}>
          <TableColumnTitle>DataCenter Id</TableColumnTitle>
          <TableColumnTitle>Name</TableColumnTitle>
          <TableColumnTitle>Country</TableColumnTitle>
          <TableColumnTitle>City</TableColumnTitle>
          <TableColumnTitle>Tier</TableColumnTitle>
          <TableColumnTitle>Certificates</TableColumnTitle>
          <TableColumnTitle>Providers</TableColumnTitle>
          <TableColumnTitle>Peers</TableColumnTitle>
        </TableHeader>
        <TableBody
          skeletonCount={DATA_CENTERS_PER_PAGE}
          skeletonHeight={48}
          isLoading={isLoading}
        >
          {pageDataCenters?.map((dataCenter) => (
            <DataCenterRow key={dataCenter.id} dataCenter={dataCenter} />
          ))}
        </TableBody>
      </ScrollableTable>
      <Space height="32px" />
      <TablePagination>
        {!dataCenters ? (
          <Skeleton width={200} height={34} count={1} />
        ) : (
          dataCenters.total !== null && (
            <Pagination
              pages={getTotalPages(String(dataCenters.total))}
              page={page}
              hasNextPage={hasNextPage}
              onSelect={selectPage}
            />
          )
        )}
      </TablePagination>
    </>
  )
}

interface DataCenterRowProps {
  dataCenter: Pick<
    Datacenter,
    | 'id'
    | 'certifications'
    | 'countryCode'
    | 'cityIndex'
    | 'cityCode'
    | 'tier'
    | 'providerCount'
    | 'peerCount'
  >
}

const DataCenterRow: React.FC<DataCenterRowProps> = ({ dataCenter }) => {
  return (
    <RowBlock>
      <RowHeader>
        <RowTrigger>
          <Row template={template}>
            <Cell>
              <A href={`/data-center/${dataCenter.id}`}>
                {formatHexData(dataCenter.id)}
              </A>
            </Cell>
            <Cell
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="center"
            >
              <Text size={12}>{getDatacenterCode(dataCenter)}</Text>
            </Cell>
            <Cell
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="center"
            >
              <Text size={12}>{dataCenter.countryCode}</Text>
            </Cell>
            <Cell
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="center"
            >
              <Text size={12}>{dataCenter.cityCode}</Text>
            </Cell>
            <Cell
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="center"
            >
              <Text size={12}> {dataCenter.tier}</Text>
            </Cell>
            <Cell
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="center"
            >
              <Text size={12}> {dataCenter.certifications?.join(', ')}</Text>
            </Cell>
            <Cell
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="center"
            >
              <Text size={12}> {dataCenter.providerCount}</Text>
            </Cell>
            <Cell
              flexDirection="column"
              alignItems="flex-start"
              justifyContent="center"
            >
              <Text size={12}> {dataCenter.peerCount}</Text>
            </Cell>
          </Row>
        </RowTrigger>
      </RowHeader>
    </RowBlock>
  )
}
