import React from 'react'
import { useLocation } from 'wouter'

import { ShrinkText, Text, TextProps } from './Text'

interface AProps extends TextProps {
  href: string
  children: React.ReactNode | React.ReactNode[]
}

export const A: React.FC<AProps> = ({ children, href, ...textProps }) => {
  const [, navigate] = useLocation()

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    navigate(href)
  }

  return (
    <ShrinkText size={12} color="blue" {...textProps}>
      <a href={href} onClick={handleClick}>
        <Text size={12} color="blue" {...textProps}>
          {children}
        </Text>
      </a>
    </ShrinkText>
  )
}
