import React from 'react'

import { ComputeUnitWorkerDetail } from '../clients/dealExplorerClient/types/schemes.ts'

import { Status } from './Status'
import { Text } from './Text'

interface WorkerStatusProps {
  status: ComputeUnitWorkerDetail['workerStatus']
}

export const WorkerStatus: React.FC<WorkerStatusProps> = ({ status }) => {
  if (status === 'registered') {
    return (
      <Status color="blue">
        <Text color="white" weight={800} size={10} uppercase>
          Registered
        </Text>
      </Status>
    )
  }

  if (status === 'waitingRegistration') {
    return (
      <Status color="grey200">
        <Text color="grey500" weight={800} size={10} uppercase>
          Waiting...
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
