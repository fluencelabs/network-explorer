import React from 'react'
import styled from '@emotion/styled'
import * as RadixTooltip from '@radix-ui/react-tooltip'

import { InfoIcon } from '../assets/icons'

import { Colors, colors } from '../constants/colors'

interface TooltipProps {
  children: React.ReactNode | React.ReactNode[]
  fill?: Colors
  trigger?: React.ReactNode | React.ReactNode[]
}

export const Tooltip: React.FC<TooltipProps> = ({
  children,
  fill = 'white',
  trigger = <InfoIcon />,
}) => {
  return (
    <RadixTooltip.Provider delayDuration={0}>
      <RadixTooltip.Root>
        <RadixTooltip.Trigger asChild>
          <button style={{ height: '16px' }}>{trigger}</button>
        </RadixTooltip.Trigger>
        <RadixTooltip.Portal>
          <Content sideOffset={5} fill={fill}>
            {children}
            <Arrow fill={fill} />
          </Content>
        </RadixTooltip.Portal>
      </RadixTooltip.Root>
    </RadixTooltip.Provider>
  )
}

const Content = styled(RadixTooltip.Content)<{ fill: Colors }>`
  padding: 8px 16px;
  border-radius: 4px;
  background: ${({ fill }) => colors[fill]};
  box-shadow:
    0px 4px 6px -2px #18181b0d,
    0px 10px 15px -3px #18181b1a;
  z-index: 10000;
`

const Arrow = styled(RadixTooltip.Arrow)<{ fill: Colors }>`
  fill: ${({ fill }) => colors[fill]};
`
