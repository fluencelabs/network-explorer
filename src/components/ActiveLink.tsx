import React, { PropsWithChildren } from 'react'
import styled from '@emotion/styled'
import { Link, LinkProps, useLocation, useRouter } from 'wouter'

import { colors } from '../constants/colors'

type ActiveLinkProps = PropsWithChildren<LinkProps> & {
  routes?: string[]
}

export const ActiveLink: React.FC<ActiveLinkProps> = ({ routes, ...props }) => {
  const [location] = useLocation()
  const router = useRouter()

  const isActive = (routes ?? [props.href!]).some(
    (route) => router.matcher(route, location)[0],
  )

  return (
    <StyledLink {...props} isActive={isActive}>
      {props.children}
    </StyledLink>
  )
}

const StyledLink = styled(Link)<{ isActive: boolean }>`
  font-size: 14px;
  color: ${({ isActive }) =>
    isActive === true ? colors.black900 : colors.grey400};

  &:hover {
    color: ${colors.black900};
  }
`
