import React, { useMemo } from 'react'
import styled from '@emotion/styled'

import { media } from '../hooks/useMedia'

import { ROUTES, Routes } from '../constants'

import { ActiveLink } from './ActiveLink'

const MENU: {
  title: string
  link: Routes[keyof Routes]
  routes?: Routes[keyof Routes][]
}[] = [
  {
    title: 'Providers',
    link: ROUTES.providers,
    routes: [
      ROUTES.providers,
      ROUTES.providerInfo,
      ROUTES.providerOffers,
      ROUTES.providerDeals,
    ],
  },
  {
    title: 'Offers',
    link: ROUTES.offers,
    routes: [ROUTES.offers, ROUTES.offerInfo],
  },
  {
    title: 'Deals',
    link: ROUTES.deals,
    routes: [ROUTES.deals, ROUTES.dealInfo],
  },
  {
    title: 'Capacity',
    link: ROUTES.capacities,
    routes: [ROUTES.capacities, ROUTES.capacityInfo],
  },
]

export const Menu: React.FC = () => {
  const links = useMemo(() => {
    return MENU.map((item) => (
      <StyledActiveLink href={item.link} key={item.title} routes={item.routes}>
        {item.title}
      </StyledActiveLink>
    ))
  }, [])

  return <MenuBlock>{links}</MenuBlock>
}

const MenuBlock = styled.div`
  display: flex;
  gap: 40px;

  ${media.tablet} {
    gap: 12px;
  }

  ${media.mobile} {
    display: none;
  }
`

const StyledActiveLink = styled(ActiveLink)`
  font-size: 16px;
`
