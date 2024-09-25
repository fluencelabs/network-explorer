import React from 'react'
import { useLocation } from 'wouter'

import { ShrinkText, Text, TextProps } from './Text'

interface AProps extends TextProps {
  href: string
  children: React.ReactNode | React.ReactNode[]
}

function sameOrigin(a: string, b: string) {
  const base = window.location.origin
  const urlA = new URL(a, base)
  const urlB = new URL(b, base)
  return urlA.origin === urlB.origin
}

export const A: React.FC<AProps> = ({ children, href, ...textProps }) => {
  const [, navigate] = useLocation()

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation()
    e.preventDefault()
    navigate(href)
  }

  const linkProps = sameOrigin(href, window.location.href)
    ? { onClick: handleClick }
    : { target: '_blank', rel: 'noopener noreferrer' }

  return (
    <ShrinkText size={12} color="blue" {...textProps}>
      <a href={href} {...linkProps}>
        <Text size={12} color="blue" {...textProps}>
          {children}
        </Text>
      </a>
    </ShrinkText>
  )
}
