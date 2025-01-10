import React from 'react'

import { Space } from '../../components/Space'
import { usePagination } from '../../hooks'

import { DATA_CENTERS_PER_PAGE, DataCentersTable } from './DataCentersTable'

export const DataCenters: React.FC = () => {
  const pagination = usePagination(DATA_CENTERS_PER_PAGE)

  return (
    <>
      <Space height="40px" />
      <DataCentersTable pagination={pagination} />
    </>
  )
}
