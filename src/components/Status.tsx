import React from 'react'
import styled from '@emotion/styled'

import { Colors, colors } from '../constants/colors'

type StatusColor = Extract<Colors, 'green' | 'red' | 'blue' | 'grey300'>

interface StatusProps {
  type?: 'label' | 'dot'
  color: StatusColor
  children?: React.ReactNode | React.ReactNode[]
}

export const Status: React.FC<StatusProps> = ({
  type = 'label',
  color,
  children,
}) => {
  if (type === 'dot') {
    return <Dot color={color} />
  }

  return <Badge color={color}>{children}</Badge>
}

const Dot = styled.div<{ color: StatusColor }>`
  width: 8px;
  height: 8px;
  border-radius: 365px;
  background: ${({ color }) => colors[color]};
`

const Badge = styled.div<{ color: StatusColor }>`
  display: flex;
  align-items: center;
  background: ${({ color }) => colors[color]};
  border-radius: 100px;
  padding: 0 6px;
  height: 16px;
  width: fit-content;
`
