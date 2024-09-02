import React from 'react'
import { STATUS_NAMES } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/constants'
import { CapacityCommitmentStatus } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/schemes'

import { STATUS_COLORS } from '../constants/statuses'

import { Status } from './Status'
import { Text } from './Text'

interface CapacityStatusProps {
  status: CapacityCommitmentStatus
}

export const CapacityStatus: React.FC<CapacityStatusProps> = ({ status }) => {
  const title = STATUS_NAMES[status]
  const color = STATUS_COLORS[status]

  return (
    <Status color={color}>
      <Text color="white" weight={800} size={10} uppercase>
        {title}
      </Text>
    </Status>
  )
}
