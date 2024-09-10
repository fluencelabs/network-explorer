import React from 'react'
import styled from '@emotion/styled'

import D0 from '../assets/providers/d0.svg?react'
import D1 from '../assets/providers/d1.svg?react'
import D2 from '../assets/providers/d2.svg?react'
import D3 from '../assets/providers/d3.svg?react'
import D4 from '../assets/providers/d4.svg?react'
import D5 from '../assets/providers/d5.svg?react'
import D6 from '../assets/providers/d6.svg?react'
import D7 from '../assets/providers/d7.svg?react'
import D8 from '../assets/providers/d8.svg?react'
import D9 from '../assets/providers/d9.svg?react'
import D10 from '../assets/providers/d10.svg?react'
import D11 from '../assets/providers/d11.svg?react'
import D12 from '../assets/providers/d12.svg?react'
import D13 from '../assets/providers/d13.svg?react'
import D14 from '../assets/providers/d14.svg?react'
import D15 from '../assets/providers/d15.svg?react'
import D16 from '../assets/providers/d16.svg?react'
import { getUniqueNumbersFromAddress } from '../utils/getUniqueNumbersFromAddress'

import { Range } from '../typings/types'

interface Props {
  address: string
  size?: number
}

const ICON_MAP: Record<Range<17>, React.FC> = {
  0: D0,
  1: D1,
  2: D2,
  3: D3,
  4: D4,
  5: D5,
  6: D6,
  7: D7,
  8: D8,
  9: D9,
  10: D10,
  11: D11,
  12: D12,
  13: D13,
  14: D14,
  15: D15,
  16: D16,
}

const COLOR_MAP: Record<Range<8>, string> = {
  0: '#81C93A',
  1: '#C563E8',
  2: '#FFC700',
  3: '#FF4E4E',
  4: '#0084FF',
  5: '#F3EA00',
  6: '#B7B7B7',
  7: '#18181B',
}

export const ProviderIcon: React.FC<Props> = ({ address, size = 24 }) => {
  const { icon: iconIndex, color: colorIndex } =
    getUniqueNumbersFromAddress(address)
  const Icon = ICON_MAP[iconIndex]
  const color = COLOR_MAP[colorIndex]

  return (
    <ProviderIconContainer color={color} size={size}>
      <Icon />
    </ProviderIconContainer>
  )
}

const ProviderIconContainer = styled.div<{ color?: string; size: number }>`
  display: flex;
  align-items: center;
  justify-content: center;

  color: ${({ color }) => color};

  width: ${({ size }) => size}px;
  height: ${({ size }) => size}px;
`
