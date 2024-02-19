import React from 'react'
import styled from '@emotion/styled'

import { colors } from '../constants/colors'

import { Text } from './Text'

const BaseButton = styled.button`
  display: flex;
  align-items: center;
  cursor: pointer;
  gap: 4px;
`

const StyledText = styled(Text)`
  display: flex;
  align-items: center;
`

const AuthButton = styled(BaseButton)`
  background-color: ${colors.black900};
  padding: 6px 16px;

  border-radius: 16px;
  height: 28px;
`

const OutlineButton = styled(BaseButton)`
  padding: 7px 8px;
  border-radius: 8px;
  border: 1px solid ${colors.grey200};
  height: 32px;

  ${StyledText} {
    color: ${colors.black900};
    text-transform: none;
    font-size: 14px;
    font-weight: 500;
  }
`

const buttons = {
  auth: AuthButton,
  outline: OutlineButton,
}

interface ButtonProps {
  leftIcon?: React.ReactNode
  children: React.ReactNode | React.ReactNode[]
  rightIcon?: React.ReactNode
  variant: keyof typeof buttons
  onClick?: () => void
  className?: string
}

export const Button: React.FC<ButtonProps> = ({
  children,
  variant,
  leftIcon,
  rightIcon,
  className,
  onClick,
}) => {
  const Button = buttons[variant]

  return (
    <Button className={className} onClick={onClick}>
      {leftIcon}
      <StyledText color="white" size={10} weight={800} uppercase>
        {children}
      </StyledText>
      {rightIcon}
    </Button>
  )
}
