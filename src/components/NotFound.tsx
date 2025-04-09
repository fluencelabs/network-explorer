import React from 'react'
import styled from '@emotion/styled'

import { A } from './A'
import { Button } from './Button'
import { Space } from './Space'
import { Text } from './Text'

export const NotFound: React.FC<{
  message?: string
  link?: string
  linkText?: string
}> = ({ message, link, linkText }) => {
  return (
    <Centered>
      <Text size={60}>404</Text>
      <Space height="8px" />
      {message && (
        <Text size={24} color="grey400">
          {message}
        </Text>
      )}
      {link && (
        <A href={link}>
          <Button variant="outline">{linkText}</Button>
        </A>
      )}
    </Centered>
  )
}

const Centered = styled.div`
  display: flex;
  flex-direction: column;
  gap: 18px;
  justify-content: center;
  align-items: center;
  margin-top: 42px;
`
