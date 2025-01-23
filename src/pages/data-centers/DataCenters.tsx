import React from 'react'

import { PageHeader } from '../../components/PageHeader'
import { Space } from '../../components/Space'
import { Text } from '../../components/Text'
import { usePagination } from '../../hooks'

import { DATA_CENTERS_PER_PAGE, DataCentersTable } from './DataCentersTable'

export const DataCenters: React.FC = () => {
  const pagination = usePagination(DATA_CENTERS_PER_PAGE)

  return (
    <>
      <PageHeader>
        <Text size={32}>List of datacenters</Text>
      </PageHeader>
      <Space height="40px" />
      <DataCentersTable pagination={pagination} />
    </>
  )
}
