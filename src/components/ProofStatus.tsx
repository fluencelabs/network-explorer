import React from 'react'

import { Status } from './Status'
import { Text } from './Text'

interface ProofStatusProps {
  status: 'success' | 'failed'
}

export const ProofStatus: React.FC<ProofStatusProps> = ({ status }) => {
  if (status === 'success') {
    return (
      <Status color="green">
        <Text color="white" weight={800} size={10} uppercase>
          Success
        </Text>
      </Status>
    )
  }

  if (status === 'failed') {
    return (
      <Status color="red">
        <Text color="white" weight={800} size={10} uppercase>
          Failed
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
