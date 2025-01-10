import React, { useState } from 'react'
import Skeleton from 'react-loading-skeleton'
import { OrderType } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/filters'

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
import { useApiQuery, usePagination } from '../../hooks'
import { formatHexData } from '../../utils/helpers'

const template = [
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
  'minmax(10px, 1fr)',
]

export const DATA_CENTERS_PER_PAGE = 5

type DataCenterSort = `${DataCentersShortOrderBy}:${OrderType}`

interface DataCentersTableProps {
  pagination: ReturnType<typeof usePagination>
}

export const DataCentersTable: React.FC<DataCentersTableProps> = ({
  pagination,
}) => {
  const [order] = useState<DataCenterSort>('createdAt:desc')
  const [orderBy, orderType] = order.split(':') as [
    DataCentersShortOrderBy,
    OrderType,
  ]

  const { page, selectPage, limit, offset, getTotalPages } = pagination

  const { data: dataCenters, isLoading } = useApiQuery(
    (client) => {
      return client.getDataCenters({}, offset, limit + 1, orderBy, orderType)
    },
    [page, orderBy, orderType],
    {
      key: `dataCenters:${JSON.stringify({
        offset,
        limit,
        order,
        orderBy,
      })}`,
      ttl: 1_000 * 60, // 1 minute
    },
  )

  const hasNextPage = dataCenters && dataCenters.data.length > limit
  const pageDataCenters = dataCenters && dataCenters.data.slice(0, limit)

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
        </TableHeader>
        <TableBody
          skeletonCount={DATA_CENTERS_PER_PAGE}
          skeletonHeight={48}
          isLoading={isLoading}
        >
          {pageDataCenters?.map((dataCenters) => (
            <DataCenterRow key={dataCenters.id} dataCenter={dataCenters} />
          ))}
        </TableBody>
      </ScrollableTable>
      <Space height="32px" />
      <TablePagination>
        {!dataCenters ? (
          <Skeleton width={200} height={34} count={1} />
        ) : (
          <Pagination
            pages={getTotalPages(dataCenters.total)}
            page={page}
            hasNextPage={hasNextPage}
            onSelect={selectPage}
          />
        )}
      </TablePagination>
    </>
  )
}

interface DataCenterRowProps {
  dataCenter: DataCenterShort
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
            <Cell flexDirection="column" alignItems="flex-start">
              {dataCenter.countryCode}-{dataCenter.cityCode}-{dataCenter.index}
            </Cell>
            <Cell flexDirection="column" alignItems="flex-start">
              {dataCenter.countryCode}
            </Cell>
            <Cell flexDirection="column" alignItems="flex-start">
              {dataCenter.cityCode}
            </Cell>
            <Cell flexDirection="column" alignItems="flex-start">
              {dataCenter.tier}
            </Cell>
            <Cell flexDirection="column" alignItems="flex-start">
              {dataCenter.certifications?.join(', ')}
            </Cell>
          </Row>
        </RowTrigger>
      </RowHeader>
    </RowBlock>
  )
}
