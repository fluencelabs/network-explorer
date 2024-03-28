import React from 'react'
import { CapacityCommitmentStatus as ICapacityCommitmentStatus } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/schemes'

import { Status } from './Status'
import { Text } from './Text'

interface CapacityStatusProps {
  status: ICapacityCommitmentStatus
}

export const CapacityStatus: React.FC<CapacityStatusProps> = ({ status }) => {
  if (status === 'active') {
    return (
      <Status color="green">
        <Text color="white" weight={800} size={10} uppercase>
          Active
        </Text>
      </Status>
    )
  }

  if (status === 'inactive') {
    return (
      <Status color="grey300">
        <Text color="white" weight={800} size={10} uppercase>
          Inactive
        </Text>
      </Status>
    )
  }

  if (status === 'failed') {
    return (
      <Status color="grey300">
        <Text color="white" weight={800} size={10} uppercase>
          Failed
        </Text>
      </Status>
    )
  }

  if (status === 'removed') {
    return (
      <Status color="grey300">
        <Text color="white" weight={800} size={10} uppercase>
          Removed
        </Text>
      </Status>
    )
  }

  if (status === 'waitDelegation') {
    return (
      <Status color="grey300">
        <Text color="white" weight={800} size={10} uppercase>
          Wait delegation
        </Text>
      </Status>
    )
  }

  if (status === 'waitStart') {
    return (
      <Status color="grey300">
        <Text color="white" weight={800} size={10} uppercase>
          Wait start
        </Text>
      </Status>
    )
  }

  return (
    <Status color="red">
      <Text color="white" weight={800} size={10} uppercase>
        undefined
      </Text>
    </Status>
  )
}
