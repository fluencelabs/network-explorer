import React from 'react'
import styled from '@emotion/styled'

import { InfoOutlineIcon } from '../assets/icons'

import { Effector } from '../clients/dealExplorerClient/types/schemes.ts'

import { Text } from './Text'
import { Tooltip } from './Tooltip'

interface Props {
  effectors: Effector[]
}

export const EffectorsTooltip: React.FC<Props> = ({ effectors }) => {
  return (
    <Tooltip trigger={<InfoOutlineIcon />}>
      <TooltipContent>
        {effectors.map((effector) => (
          <TooltipEffectorRow key={effector.cid}>
            <Text size={10} color="grey400" weight={300}>
              {effector.description}
            </Text>
            <Text size={12}>{effector.cid}</Text>
          </TooltipEffectorRow>
        ))}
      </TooltipContent>
    </Tooltip>
  )
}

const TooltipContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const TooltipEffectorRow = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`
