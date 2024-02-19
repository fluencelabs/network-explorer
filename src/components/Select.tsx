import React from 'react'
import styled from '@emotion/styled'
import * as RadixSelect from '@radix-ui/react-select'

import { ArrowIcon } from '../assets/icons'

import { colors } from '../constants/colors'

import { Button } from './Button'
import { Text } from './Text'

export interface SelectItem<Value extends string = string> {
  value: Value
  label: string
  icon?: React.ReactNode
}

interface SelectProps<Value extends string> {
  items: SelectItem<Value>[]
  value: Value
  onChange: (value: Value) => void
  children?: (item: SelectItem) => React.ReactNode | React.ReactNode[]
}

export const Select = <Value extends string>({
  items,
  value,
  onChange,
  children,
}: SelectProps<Value>) => {
  return (
    <RadixSelect.Root value={value} onValueChange={onChange}>
      <RadixSelect.Trigger>
        {children ? (
          children(items.find((i) => i.value === value)!)
        ) : (
          <StyledButton variant="outline">
            <RadixSelect.Value />
            <RadixSelect.Icon>
              <StyledArrowIcon />
            </RadixSelect.Icon>
          </StyledButton>
        )}
      </RadixSelect.Trigger>
      <RadixSelect.Portal>
        <Content position="popper">
          <Viewport>
            {items.map(({ value, label, icon }) => {
              return (
                <Item value={value} key={value}>
                  {icon}
                  <RadixSelect.ItemText>
                    <Text size={14}>{label}</Text>
                  </RadixSelect.ItemText>
                </Item>
              )
            })}
          </Viewport>
        </Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  )
}

const StyledButton = styled(Button)`
  justify-content: center;
`

const Content = styled(RadixSelect.Content)`
  overflow: hidden;
  background-color: ${colors.white};
  border-radius: 6px;
  margin-top: 5px;
  box-shadow:
    0px 4px 6px -2px #18181b0d,
    0px 10px 15px -3px #18181b1a;
  padding: 12px;
  gap: 8px;
`

const Viewport = styled(RadixSelect.Viewport)``

const Item = styled(RadixSelect.Item)`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
  height: 24px;
  transition: background-color 100ms;

  border: none;

  :hover {
    border: none;
    background-color: ${colors.grey200};
  }
`

const StyledArrowIcon = styled(ArrowIcon)`
  transform: rotate(90deg);
  margin-left: 3px;
  path {
    fill: ${colors.grey400};
  }
`
