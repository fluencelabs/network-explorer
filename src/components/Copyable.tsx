import React, { ReactNode, useState } from 'react'
import styled from '@emotion/styled'
import * as RadixTooltip from '@radix-ui/react-tooltip'
import copy from 'copy-to-clipboard'

import { CopyIcon } from '../assets/icons'

import { colors } from '../constants/colors'

import { Text } from './Text'

interface CopyableProps {
  value: string
  className?: string
  children?: ReactNode
}

export const Copyable: React.FC<CopyableProps> = ({
  value,
  className,
  children = <StyledCopyIcon />,
}) => {
  const [notify, setNotify] = useState(false)

  const handleCopy = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation()
    copy(value)

    if (!notify) {
      setNotify(true)
      setTimeout(() => setNotify(false), 500)
    }
  }

  return (
    <>
      <RadixTooltip.Provider delayDuration={0}>
        <RadixTooltip.Root open={notify}>
          <RadixTooltip.Trigger asChild>
            <button
              className={className}
              style={{ height: '16px' }}
              onClick={handleCopy}
            >
              {children}
            </button>
          </RadixTooltip.Trigger>
          <RadixTooltip.Portal>
            <Content sideOffset={5}>
              <Text>Copied!</Text>
            </Content>
          </RadixTooltip.Portal>
        </RadixTooltip.Root>
      </RadixTooltip.Provider>
    </>
  )
}

const StyledCopyIcon = styled(CopyIcon)`
  cursor: pointer;
`

const Content = styled(RadixTooltip.Content)`
  padding: 4px 12px 5px 12px;
  border-radius: 4px;
  background: ${colors.white};
  box-shadow:
    0px 4px 6px -2px #18181b0d,
    0px 10px 15px -3px #18181b1a;
`
