import React from 'react'
import styled from '@emotion/styled'

import { Logo } from '../assets/icons'
import { media } from '../hooks/useMedia'

import { ROUTES } from '../constants'
import { colors } from '../constants/colors'

import { Menu } from './Menu'
import { RightMenu } from './RightMenu'
// import { ConnectButton } from '@rainbow-me/rainbowkit'

export const Header: React.FC = () => {
  return (
    <HeaderBackgroundBlock>
      <HeaderBlock>
        <a href={ROUTES.providers}>
          <Logo />
        </a>
        <Menu />
        <div>
          <RightMenu />
          <div
            style={{
              display: 'flex',
              justifyContent: 'flex-end',
              marginTop: '6px',
            }}
          >
            {/* <ConnectButton /> */}
          </div>
        </div>
      </HeaderBlock>
    </HeaderBackgroundBlock>
  )
}

const HeaderBlock = styled.div`
  display: flex;
  justify-content: space-between;
  // align-items: center;

  width: 100%;
  padding: 16px 24px;
`
const HeaderBackgroundBlock = styled.div`
  display: flex;
  align-items: flex-start;
  background-color: ${colors.grey100};
  min-height: 180px;

  ${media.mobile} {
    min-height: 70px;
  }
`
