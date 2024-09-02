import React from 'react'
import { ReactNode } from 'react'

import { InfoOutlineIcon } from '../assets/icons'

import { Text } from './Text'
import { Tooltip } from './Tooltip'

export default function Hint({ children }: { children: ReactNode }) {
  return (
    <Tooltip trigger={<InfoOutlineIcon />}>
      <Text color="grey600" weight={600} size={12}>
        {children}
      </Text>
    </Tooltip>
  )
}
