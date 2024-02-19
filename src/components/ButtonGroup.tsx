import React from 'react'
import styled from '@emotion/styled'

import { colors } from '../constants/colors'

interface ButtonGroupProps<Value extends string> {
  value: Value
  onSelect: (value: Value) => void
  items: {
    value: Value
    label: string
  }[]
}

export const ButtonGroup = <Value extends string>({
  value,
  items,
  onSelect,
}: ButtonGroupProps<Value>) => {
  return (
    <ButtonGroupBlock>
      {items.map((item) => (
        <Button
          key={item.value}
          isActive={value === item.value}
          onClick={() => onSelect(item.value)}
        >
          {item.label}
        </Button>
      ))}
    </ButtonGroupBlock>
  )
}

const Button = styled.button<{
  isActive: boolean
}>`
  border: none;
  outline: none;

  padding: 6px 12px;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;

  color: ${colors.grey500};

  ${({ isActive }) =>
    isActive
      ? `
    color: ${colors.black900};
    background: ${colors.white};
    box-shadow: 0px 1px 2px 0px #18181B0F, 0px 1px 3px 0px #18181B1A;
  `
      : ''}
`

const ButtonGroupBlock = styled.div`
  display: flex;
  align-items: center;
  background: ${colors.grey100};
  padding: 2px;
  border-radius: 8px;
  width: fit-content;
`
