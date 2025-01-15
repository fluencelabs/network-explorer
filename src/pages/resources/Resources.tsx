import React from 'react'

import { PageHeader } from '../../components/PageHeader'
import { Space } from '../../components/Space'
import { Text } from '../../components/Text'

import { ResourceTable } from './ResourceTable'

export const Resources: React.FC = () => {
  return (
    <>
      <PageHeader>
        <Text size={32}>List of resources</Text>
      </PageHeader>
      <Space height="40px" />
      <ResourceTable />
    </>
  )
}
