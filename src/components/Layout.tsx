import React from 'react'
import styled from '@emotion/styled'

import { Header } from './Header'

export const Layout: React.FC<{
  children: React.ReactNode | React.ReactNode[]
}> = ({ children }) => {
  return (
    <LayoutBlock>
      <Header />
      <Content>{children}</Content>
    </LayoutBlock>
  )
}

const LayoutBlock = styled.div`
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`

const Content = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px 24px;
`
