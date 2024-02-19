import React from 'react'
import { DealStatus as IDealStatus } from '@fluencelabs/deal-aurora/dist/dealExplorerClient/types/schemes'

import { Status } from './Status'
import { Text } from './Text'

interface DealStatusProps {
  status: IDealStatus
}

export const DealStatus: React.FC<DealStatusProps> = ({ status }) => {
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

  if (status === 'ended') {
    return (
      <Status color="blue">
        <Text color="white" weight={800} size={10} uppercase>
          Ended
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
