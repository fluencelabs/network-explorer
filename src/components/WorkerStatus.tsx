import React from 'react'

import { Status } from './Status'
import { Text } from './Text'

interface WorkerStatusProps {
  hasOffChainId: boolean
}

export const WorkerStatus: React.FC<WorkerStatusProps> = ({
  hasOffChainId,
}) => {
  if (hasOffChainId) {
    return (
      <Status color="blue">
        <Text color="white" weight={800} size={10} uppercase>
          Registered
        </Text>
      </Status>
    )
  }

  return (
    <Status color="grey200">
      <Text color="grey500" weight={800} size={10} uppercase>
        Waiting registration
      </Text>
    </Status>
  )
}
