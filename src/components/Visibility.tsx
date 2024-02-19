import React from 'react'

interface VisibilityProps {
  if?: unknown
  children: React.ReactNode | React.ReactNode[]
}

export const Hide: React.FC<VisibilityProps> = ({
  if: condition,
  children,
}) => {
  return condition ? null : children
}

export const Display: React.FC<VisibilityProps> = ({
  if: condition,
  children,
}) => {
  return condition ? children : null
}
