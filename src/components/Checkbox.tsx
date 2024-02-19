import React from 'react'
import styled from '@emotion/styled'
import * as RadixCheckbox from '@radix-ui/react-checkbox'

import { CheckIcon } from '../assets/icons'

import { colors } from '../constants/colors'

interface CheckboxProps {
  id: string
  checked: boolean
  label: React.ReactNode
  onToggle: (value: boolean) => void
}

export const Checkbox: React.FC<CheckboxProps> = ({
  id,
  checked,
  label,
  onToggle,
}) => {
  return (
    <Container>
      <CheckboxRoot checked={checked} onCheckedChange={onToggle} id={id}>
        <RadixCheckbox.Indicator>
          <CheckIcon />
        </RadixCheckbox.Indicator>
      </CheckboxRoot>
      <Label htmlFor={id}>{label}</Label>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`

const Label = styled.label`
  display: flex;
  cursor: pointer;
  user-select: none;
`

const CheckboxRoot = styled(RadixCheckbox.Root)`
  border: 1px solid ${colors.black900};
  width: 16px;
  height: 16px;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  &[data-state='checked'] {
    background-color: ${colors.black900};
    /* border: none; */
  }
`
