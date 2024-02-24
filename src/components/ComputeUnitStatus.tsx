import React from 'react'
import { ComputeUnitStatus as IComputeUnitStatus } from '@fluencelabs/deal-aurora/dist/dealExplorerClient/types/schemes'

import { Status } from './Status'
import { Text } from './Text'

interface ComputeUnitStatusProps {
  status: IComputeUnitStatus
}

export const ComputeUnitStatus: React.FC<ComputeUnitStatusProps> = ({
  status,
}) => {
  if (status === 'capacity') {
    return (
      <Status color="blue">
        <Text color="white" weight={800} size={10} uppercase>
          Capcity
        </Text>
      </Status>
    )
  }

  if (status === 'deal') {
    return (
      <Status color="green">
        <Text color="white" weight={800} size={10} uppercase>
          Deal
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
