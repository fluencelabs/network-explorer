import React from 'react'
import styled from '@emotion/styled'
import { ContractsENV } from '@fluencelabs/deal-aurora'
import * as RadixSelect from '@radix-ui/react-select'

import { DocsIcon } from '../assets/icons'
import { MainnetIcon, TestnetIcon } from '../assets/icons'
import { ArrowIcon } from '../assets/icons'

import { colors } from '../constants/colors'
import { useAppStore } from '../store'

import { Button } from './Button'
import { Select, SelectItem } from './Select'
import { Text } from './Text'

const items: SelectItem<ContractsENV>[] = [
  {
    label: 'Local',
    value: 'local',
    icon: <TestnetIcon />,
  },
  {
    label: 'Stage',
    value: 'stage',
    icon: <MainnetIcon />,
  },
  {
    label: 'Dar',
    value: 'dar',
    icon: <TestnetIcon />,
  },
  {
    label: 'Kras',
    value: 'kras',
    icon: <MainnetIcon />,
  },
]

export const RightMenu: React.FC = () => {
  const network = useAppStore((s) => s.network)
  const setNetwork = useAppStore((s) => s.setNetwork)

  return (
    <RightMenuBlock>
      <LinksBlock>
        <StyledA href="#">
          <DocsIcon />
          <Text size={14}>Docs</Text>
        </StyledA>
      </LinksBlock>
      <Select value={network} onChange={setNetwork} items={items}>
        {(item) => {
          return (
            <StyledButton variant="outline" leftIcon={item.icon}>
              <RadixSelect.Value />
              <RadixSelect.Icon>
                <StyledArrowIcon />
              </RadixSelect.Icon>
            </StyledButton>
          )
        }}
      </Select>
    </RightMenuBlock>
  )
}

const RightMenuBlock = styled.div`
  display: flex;
  gap: 24px;
`

const LinksBlock = styled.div`
  display: flex;
  gap: 16px;
`

const StyledA = styled.a`
  display: flex;
  align-items: center;
  gap: 4px;
`

const StyledButton = styled(Button)`
  width: 110px;
  justify-content: center;
  background: ${colors.white};
  border-radius: 6px;
  border: none;
  box-shadow:
    0px 1px 2px 0px #18181b0f,
    0px 1px 3px 0px #18181b1a;
`

const StyledArrowIcon = styled(ArrowIcon)`
  transform: rotate(90deg);
  margin-left: 3px;
  path {
    fill: ${colors.black900};
  }
`
