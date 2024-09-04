import React from 'react'
import styled from '@emotion/styled'
import { STATUS_NAMES } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/constants'
import { CapacityCommitmentStatus } from '@fluencelabs/deal-ts-clients/dist/dealExplorerClient/types/schemes'

import { Select } from './Select'
import { Text } from './Text'

export type SelectStatusValue = CapacityCommitmentStatus | 'all'

const items: {
  value: SelectStatusValue
  label: string
}[] = [
  { value: 'all', label: 'All' },
  { value: 'active', label: STATUS_NAMES['active'] },
  { value: 'inactive', label: STATUS_NAMES['inactive'] },
  { value: 'failed', label: STATUS_NAMES['failed'] },
  { value: 'removed', label: STATUS_NAMES['removed'] },
  { value: 'waitDelegation', label: STATUS_NAMES['waitDelegation'] },
  { value: 'waitStart', label: STATUS_NAMES['waitStart'] },
]

export const SelectStatus = ({
  value,
  onChange,
}: {
  value?: SelectStatusValue
  onChange: (value: SelectStatusValue) => void
}) => {
  return (
    <StatusContainer>
      <Text size={10} weight={600} color="grey400" uppercase>
        Status
      </Text>
      <Select value={value ?? 'all'} onChange={onChange} items={items} />
    </StatusContainer>
  )
}

export const StatusContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
`
