import React from 'react'
import styled from '@emotion/styled'
import * as RadixSwitch from '@radix-ui/react-switch'

import { Text } from '../components/Text'

import { colors } from '../constants/colors'

interface SwitchProps {
  label: string
  value: boolean
  onSwitch: (value: boolean) => void
}

export const Switch: React.FC<SwitchProps> = ({ label, value, onSwitch }) => {
  return (
    <SwitchBlock>
      <Label htmlFor={label}>
        <Text size={12}>{label}</Text>
      </Label>
      <SwitchRoot checked={value} onCheckedChange={onSwitch} id={label}>
        <SwitchThumb />
      </SwitchRoot>
    </SwitchBlock>
  )
}

const SwitchBlock = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
`

const Label = styled.label`
  display: flex;
  cursor: pointer;
`

const SwitchRoot = styled(RadixSwitch.Root)`
  width: 24px;
  height: 14px;
  background-color: ${colors.grey400};
  border-radius: 14px;
  position: relative;
  cursor: pointer;

  &[data-state='checked'] {
    background-color: ${colors.blue};
  }
`

const SwitchThumb = styled(RadixSwitch.Thumb)`
  display: block;
  width: 10px;
  height: 10px;
  background-color: ${colors.white};
  border-radius: 50%;
  transition: transform 100ms;
  transform: translateX(2px);

  &[data-state='checked'] {
    transform: translateX(12px);
  }
`
